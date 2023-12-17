import { IsinScraper as IsinScraperStatic } from './isin-scraper';
import { TwseScraper as TwseScraperStatic } from './twse-scraper';
import { TpexScraper as TpexScraperStatic } from './tpex-scraper';
import { MisScraper as MisScraperStatic } from './mis-scraper';
import { TdccScraper as TdccScraperStatic } from './tdcc-scraper';

export const IsinScraper = new IsinScraperStatic();
export const TwseScraper = new TwseScraperStatic();
export const TpexScraper = new TpexScraperStatic();
export const MisScraper = new MisScraperStatic();
export const TdccScraper = new TdccScraperStatic();
