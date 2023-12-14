import { TwseScraper as TwseScraperStatic } from './twse-scraper';
import { TpexScraper as TpexScraperStatic } from './tpex-scraper';
import { MisScraper as MisScraperStatic } from './mis-scraper';
import { IsinScraper as IsinScraperStatic } from './isin-scraper';

export const TwseScraper = new TwseScraperStatic();
export const TpexScraper = new TpexScraperStatic();
export const MisScraper = new MisScraperStatic();
export const IsinScraper = new IsinScraperStatic();
