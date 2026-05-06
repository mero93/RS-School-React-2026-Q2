export interface ComicStrip {
  uid: string;
  title: string;
  publishedYearFrom?: number;
  publishedMonthFrom?: number;
  publishedDayFrom?: number;
  publishedYearTo?: number;
  publishedMonthTo?: number;
  publishedDayTo?: number;
  numberOfPages?: number;
  yearFrom?: number;
  yearTo?: number;
}
