import { TwseScraper } from './twse-scraper';
import { TpexScraper } from './tpex-scraper';
import { TaifexScraper } from './taifex-scraper';
import { TdccScraper } from './tdcc-scraper';
import { MisTwseScraper } from './mis-twse-scraper';
import { MisTaifexScraper } from './mis-taifex-scraper';
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
        [ScraperType.MisTwse]: MisTwseScraper,
        [ScraperType.MisTaifex]: MisTaifexScraper,
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

  getMisTwseScraper() {
    return this.get(ScraperType.MisTwse) as MisTwseScraper;
  }

  getMisTaifexScraper() {
    return this.get(ScraperType.MisTaifex) as MisTaifexScraper;
  }

  getMopsScraper() {
    return this.get(ScraperType.Mops) as MopsScraper;
  }

  getIsinScraper() {
    return this.get(ScraperType.Isin) as IsinScraper;
  }
}
