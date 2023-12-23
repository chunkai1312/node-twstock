import { TwseScraper } from './twse-scraper';
import { TpexScraper } from './tpex-scraper';
import { TaifexScraper } from './taifex-scraper';
import { TdccScraper } from './tdcc-scraper';
import { MisScraper } from './mis-scraper';
import { MopsScraper } from './mops-scraper';
import { IsinScraper } from './isin-scraper';
import { Scraper } from './scraper';
import { Scraper as ScraperType } from '../enums';
import { RateLimitOptions } from '../interfaces';

export class ScraperFactory {
  private readonly scrapers: Map<string, Scraper> = new Map();

  constructor(private readonly options?: RateLimitOptions) {}

  get(type: ScraperType) {
    let scraper = this.scrapers.get(type);

    if (!scraper) {
      const scrapers = {
        [ScraperType.Twse]: TwseScraper,
        [ScraperType.Tpex]: TpexScraper,
        [ScraperType.Taifex]: TaifexScraper,
        [ScraperType.Tdcc]: TdccScraper,
        [ScraperType.Mis]: MisScraper,
        [ScraperType.Mops]: MopsScraper,
        [ScraperType.Isin]: IsinScraper,
      };
      const ScraperClass = scrapers[type];

      scraper = new ScraperClass(this.options);
      this.scrapers.set(type, scraper);
    }

    return scraper;
  }

  getTwseScraper() {
    return this.get(ScraperType.Twse) as TwseScraper;
  }

  getTpexScraper() {
    return this.get(ScraperType.Tpex) as TpexScraper;
  }

  getTaifexScraper() {
    return this.get(ScraperType.Taifex) as TaifexScraper;
  }

  getTdccScraper() {
    return this.get(ScraperType.Tdcc) as TdccScraper;
  }

  getMisScraper() {
    return this.get(ScraperType.Mis) as MisScraper;
  }

  getMopsScraper() {
    return this.get(ScraperType.Mops) as MopsScraper;
  }

  getIsinScraper() {
    return this.get(ScraperType.Isin) as IsinScraper;
  }
}
