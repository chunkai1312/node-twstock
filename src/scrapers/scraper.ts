import axios, { AxiosInstance } from 'axios';

export abstract class Scraper {
  protected readonly httpService: AxiosInstance;

  constructor() {
    this.httpService = axios.create();
  }
}
