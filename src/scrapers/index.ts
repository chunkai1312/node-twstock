import { IsinTwseScraper as IsinTwseScraperStatic } from './isin-twse-scraper';
import { TwseScraper as TwseScraperStatic } from './twse-scraper';
import { TpexScraper as TpexScraperStatic } from './tpex-scraper';
import { MisTwseScraper as MisTwseScraperStatic } from './mis-twse-scraper';

export const IsinTwseScraper = new IsinTwseScraperStatic();
export const TwseScraper = new TwseScraperStatic();
export const TpexScraper = new TpexScraperStatic();
export const MisTwseScraper = new MisTwseScraperStatic();
