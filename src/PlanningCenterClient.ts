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

    const response = await axios({ ...config, method: "get" });

    if (response.status === 429) {
      this.createRetryRateLimiter(parseInt(response.headers["retry-after"] || response.headers["Retry-After"]));
      return await this.getQuery(product, resource, searchParams);
    } else if (response.status >= 200 && response.status < 300) {
      return response;
    }

    return response;
  }

  /**
   * Gets a resource from a product: handles pagination for lists of items, as well as single item
   *
   * @param product
   * @param resource
   * @returns
   */
  async *get(product: PlanningCenterProduct, resource: string) {
    const perPage = 100;
    let offset = 0;
    let total = 0;
    let response;

    do {
      response = await this.getQuery(product, resource, {
        per_page: perPage.toString(),
        offset: offset.toString(),
      });

      if (response.data.meta.total_count) {
        total = response.data.meta.total_count;
      }

      if (response.data) {
        if (Array.isArray(response.data.data)) {
          for (const row of response.data.data) {
            yield row;
          }
        } else {
          return response.data;
        }
      }

      offset += perPage;
    } while (Array.isArray(response.data) && response.data.length < total);
  }
}
