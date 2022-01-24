import axios, { AxiosResponse } from "axios";
const API_BASE_URL = "https://api.planningcenteronline.com";

export type PlanningCenterProduct = "calendar" | "check-ins" | "giving" | "groups" | "people" | "services";
export interface QueryParams {
  [key: string]: string;
}

/**
 * A PlanningCenter Online HTTP (JSON:API) client with error handling of rate limits
 */
export class PlanningCenterClient {
  private retryPromise: Promise<void> | undefined;

  constructor(private applicationKey: string, private secret: string) {}

  createQueryConfig(product: PlanningCenterProduct, resource: string, searchParams?: QueryParams) {
    const url = new URL(`${API_BASE_URL}/${product}/v2/${resource}`);

    if (searchParams) {
      url.search = new URLSearchParams(searchParams).toString();
    }

    return {
      url: url.toString(),
      auth: {
        username: this.applicationKey,
        password: this.secret,
      },
      headers: {
        "Content-Type": "application/vnd.api+json",
      },
    };
  }

  retryAfterRateLimit() {
    return this.retryPromise || Promise.resolve();
  }

  createRetryRateLimiter(retryAfter: number) {
    this.retryPromise = new Promise<void>((resolve, _reject) => {
      setTimeout(resolve, retryAfter * 1000);
    });

    return this.retryAfterRateLimit;
  }

  async getQuery(
    product: PlanningCenterProduct,
    resource: string,
    searchParams?: QueryParams
  ): Promise<AxiosResponse<any>> {
    const config = this.createQueryConfig(product, resource, searchParams);

    // wait outstanding retry rate limit
    await this.retryAfterRateLimit();

    try {
      return await axios({ ...config, method: "get" });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        const delay = error.response?.headers["retry-after"] || error.response?.headers["Retry-After"];
        console.warn(`${error.response?.config.url} quota limit hit, waiting ${delay}s!`);

        this.createRetryRateLimiter(parseInt(delay));

        return await this.getQuery(product, resource, searchParams);
      }

      throw error;
    }
  }

  /**
   * Gets a resource from a product: handles pagination for lists of items, as well as single item
   *
   * @param product
   * @param resource
   * @returns
   */
  async *get(product: PlanningCenterProduct, resource: string) {
    const perPage = "100";
    let offset = "0";
    let count = 0;
    let total = 0;
    let response;

    do {
      response = await this.getQuery(product, resource, {
        per_page: perPage,
        offset,
      });

      if (response.data.meta.total_count) {
        total = response.data.meta.total_count;
      }

      if (response.data) {
        if (Array.isArray(response.data.data)) {
          for (const row of response.data.data) {
            count++;
            yield row;
          }
        } else {
          return response.data;
        }
      }

      console.log(`got ${product}: ${resource} - offset ${offset}, count ${response.data.data.length}, total ${total}`);

      if (response.data.links?.next) {
        const url = new URL(response.data.links?.next);
        offset = url.searchParams.get("offset")!;
      }
    } while (Array.isArray(response.data?.data) && count < total);
  }
}
