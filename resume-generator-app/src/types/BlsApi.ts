type RootResponse<T> = {
  status: string;
  responseTime: number;
  message: string[];
  Results: Results<T>;
};

type BlsPopularSeries = {
  seriesID: string;
};

type Results<T> = {
  series: T[];
};

type BlsReportSeries = {
  seriesID: string;
  catalog: Catalog;
  data: Datum[];
};

type Catalog = {
  series_title: string;
  series_id: string;
  seasonality?: Seasonality;
  survey_name: string;
  survey_abbreviation: string;
  measure_data_type: string;
  area?: string;
  item?: string;
  commerce_industry?: string;
  occupation?: string;
  cps_labor_force_status?: string;
  demographic_age?: string;
  demographic_ethnic_origin?: string;
  demographic_race?: string;
  demographic_gender?: string;
  demographic_education?: string;
  commerce_sector?: string;
};

type Datum = {
  year: string;
  period: Period;
  periodName: PeriodName;
  value: string;
  footnotes: Footnote[];
  latest?: string;
};

type Footnote = {
  code?: string;
  text?: string;
};

export enum Seasonality {
  NotSeasonallyAdjusted = "Not Seasonally Adjusted",
  SeasonallyAdjusted = "Seasonally Adjusted",
}

export enum Period {
  M01 = "M01",
  M02 = "M02",
  M03 = "M03",
  M04 = "M04",
  M05 = "M05",
  M06 = "M06",
  M07 = "M07",
  M08 = "M08",
  M09 = "M09",
  M10 = "M10",
  M11 = "M11",
  M12 = "M12",
  M13 = "M13",
  Q01 = "Q01",
  Q02 = "Q02",
  Q03 = "Q03",
  Q04 = "Q04",
  Q05 = "Q05",
}

export enum PeriodName {
  Annual = "Annual",
  April = "April",
  August = "August",
  December = "December",
  February = "February",
  January = "January",
  July = "July",
  June = "June",
  March = "March",
  May = "May",
  November = "November",
  October = "October",
  September = "September",
  The1StQuarter = "1st Quarter",
  The2NdQuarter = "2nd Quarter",
  The3RDQuarter = "3rd Quarter",
  The4ThQuarter = "4th Quarter",
}

export type BlsResponse = RootResponse<BlsReportSeries>;
export type BlsSeriesListResponse = RootResponse<BlsPopularSeries>;
