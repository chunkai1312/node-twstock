import axios, { AxiosInstance } from "axios";
import * as rateLimit from "axios-rate-limit";
import * as https from "https";
import { RateLimitOptions } from "../interfaces";

export abstract class Scraper {
  protected readonly httpService: AxiosInstance;

  constructor(options: RateLimitOptions = { limit: 1, ttl: 5000 }) {
    const maxRequests = options.limit;
    const perMilliseconds = options.ttl;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.httpService = rateLimit(
      axios.create({
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      }),
      { maxRequests, perMilliseconds }
    );
  }
}
