import axios, { AxiosInstance } from 'axios';
import * as rateLimit from 'axios-rate-limit';
import { RateLimitOptions } from '../interfaces';

export abstract class Scraper {
  protected readonly httpService: AxiosInstance;

  constructor(options: RateLimitOptions = { limit: 3, ttl: 5000 }) {
    const maxRequests = options.limit;
    const perMilliseconds = options.ttl;
    // @ts-ignore
    this.httpService = rateLimit(axios.create(), { maxRequests, perMilliseconds });
  }
}
