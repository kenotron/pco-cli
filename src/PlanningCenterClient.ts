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
  private requestRetryAfter: number = 20;
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
    if (this.retryPromise) {
      return this.retryPromise;
    }

    this.retryPromise = new Promise<void>((resolve, _reject) => {
      console.log(`rate limit is hit, waiting for ${this.requestRetryAfter}s`)
      setTimeout(resolve, this.requestRetryAfter * 1000);
    });

    return this.retryPromise;
  }

  async getQuery(
    product: PlanningCenterProduct,
    resource: string,
    searchParams?: QueryParams
  ): Promise<AxiosResponse<any>> {
    const config = this.createQueryConfig(product, resource, searchParams);
    const response = await axios({ ...config, method: "get" });

    // Too many requests - rate limit
    if (response.status === 429) {
      await this.retryAfterRateLimit();
      return await this.getQuery(product, resource, searchParams);
    } else if (response.status >= 200 && response.status < 300) {
      this.requestRetryAfter = parseInt(response.headers["Retry-After"]);
      return response;
    }

    return response;
  }

  async get<T>(product: PlanningCenterProduct, resource: string): Promise<T> {
    const perPage = 100;
    let offset = 0;
    let total = 0;
    let results: unknown;

    do {
      const response = await this.getQuery(product, resource, {
        per_page: perPage.toString(),
        offset: offset.toString(),
      });

      if (response.data.meta.total_count) {
        total = response.data.meta.total_count;
      }

      if (response.data) {
        if (Array.isArray(response.data.data)) {
          results = results ?? [];
          for (const row of response.data.data) {
            (results as any[]).push(row);
          }
        } else {
          results = response.data;
        }
      }

      offset += perPage;
    } while (Array.isArray(results) && results.length < total);

    return results as T;
  }
}
