import { TwseScraper as TwseScraperStatic } from './twse-scraper';
import { TpexScraper as TpexScraperStatic } from './tpex-scraper';
import { MisScraper as MisScraperStatic } from './mis-scraper';

export const TwseScraper = new TwseScraperStatic();
export const TpexScraper = new TpexScraperStatic();
export const MisScraper = new MisScraperStatic();
