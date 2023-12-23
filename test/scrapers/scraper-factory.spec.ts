import { TwseScraper } from '../../src/scrapers/twse-scraper';
import { TpexScraper } from '../../src/scrapers/tpex-scraper';
import { TaifexScraper } from '../../src/scrapers/taifex-scraper';
import { TdccScraper } from '../../src/scrapers/tdcc-scraper';
import { MisScraper } from '../../src/scrapers/mis-scraper';
import { MopsScraper } from '../../src/scrapers/mops-scraper';
import { IsinScraper } from '../../src/scrapers/isin-scraper';
import { ScraperFactory } from '../../src/scrapers/scraper-factory';
import { Scraper as ScraperType } from '../../src/enums';

describe('ScraperFactory', () => {
  let factory: ScraperFactory;

  beforeEach(() => {
    factory = new ScraperFactory();
  });

  describe('.get()', () => {
    it('should return a TwseScraper instance when type is ScraperType.Twse', () => {
      const scraper = factory.get(ScraperType.Twse);
      expect(scraper).toBeInstanceOf(TwseScraper);
    });

    it('should return a TpexScraper instance when type is ScraperType.Tpex', () => {
      const scraper = factory.get(ScraperType.Tpex);
      expect(scraper).toBeInstanceOf(TpexScraper);
    });

    it('should return a TaifexScraper instance when type is ScraperType.Taifex', () => {
      const scraper = factory.get(ScraperType.Taifex);
      expect(scraper).toBeInstanceOf(TaifexScraper);
    });

    it('should return a TdccScraper instance when type is ScraperType.Tdcc', () => {
      const scraper = factory.get(ScraperType.Tdcc);
      expect(scraper).toBeInstanceOf(TdccScraper);
    });

    it('should return a MisScraper instance when type is ScraperType.Mis', () => {
      const scraper = factory.get(ScraperType.Mis);
      expect(scraper).toBeInstanceOf(MisScraper);
    });

    it('should return a MopsScraper instance when type is ScraperType.Mops', () => {
      const scraper = factory.get(ScraperType.Mops);
      expect(scraper).toBeInstanceOf(MopsScraper);
    });

    it('should return a IsinScraper instance when type is ScraperType.Isin', () => {
      const scraper = factory.get(ScraperType.Isin);
      expect(scraper).toBeInstanceOf(IsinScraper);
    });

    it('should return the same scraper instance when get method is called with the same type', () => {
      const scraper1 = factory.get(ScraperType.Twse);
      const scraper2 = factory.get(ScraperType.Twse);
      expect(scraper1).toBe(scraper2);
    });

    it('should create a new scraper instance when get method is called with a new type', () => {
      const scraper1 = factory.get(ScraperType.Twse);
      const scraper2 = factory.get(ScraperType.Tpex);
      expect(scraper1).not.toBe(scraper2);
    });
  });

  describe('.getTwseScraper()', () => {
    it('should create a TwseScraper instance', () => {
      const scraper = factory.getTwseScraper();
      expect(scraper).toBeInstanceOf(TwseScraper);
    });
  });

  describe('.getTpexScraper()', () => {
    it('should create a TpexScraper instance', () => {
      const scraper = factory.getTpexScraper();
      expect(scraper).toBeInstanceOf(TpexScraper);
    });
  });

  describe('.getTaifexScraper()', () => {
    it('should create a TaifexScraper instance', () => {
      const scraper = factory.getTaifexScraper();
      expect(scraper).toBeInstanceOf(TaifexScraper);
    });
  });

  describe('.getTdccScraper()', () => {
    it('should create a TdccScraper instance', () => {
      const scraper = factory.getTdccScraper();
      expect(scraper).toBeInstanceOf(TdccScraper);
    });
  });

  describe('.getMisScraper()', () => {
    it('should create a MisScraper instance when calling getMisScraper', () => {
      const scraper = factory.getMisScraper();
      expect(scraper).toBeInstanceOf(MisScraper);
    });
  });

  describe('.getMopsScraper()', () => {
    it('should create a MopsScraper instance when calling getMopsScraper', () => {
      const scraper = factory.getMopsScraper();
      expect(scraper).toBeInstanceOf(MopsScraper);
    });
  });

  describe('.getIsinScraper()', () => {
    it('should create an IsinScraper instance when calling getIsinScraper', () => {
      const scraper = factory.getIsinScraper();
      expect(scraper).toBeInstanceOf(IsinScraper);
    });
  });
});
