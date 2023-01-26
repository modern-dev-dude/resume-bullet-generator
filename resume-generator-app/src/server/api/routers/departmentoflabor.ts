import { z } from "zod";
import { serverEnv } from "../../../env/schema.mjs";
import { schemaForType } from "../../../types/tRPC_Utils";
import { createTRPCRouter, publicProcedure } from "../trpc";

type BlsResponse<T> = {
  status: string;
  responseTime: number;
  message: string[];
  Results: BlsSieries<T>;
};

type BlsSieries<T> = {
  series: T[];
};
type BlsPopularSeries = {
  seriesID: string;
};
type BlsReportSeries = {
  seriesID: string;
  catalog: Catalog;
  data: BlsReportData[];
};

type BlsReportData = {
  year: string;
  period: string;
  periodName: string;
  latest: string;
  value: string;
};

type Catalog = {
  series_title: string;
  series_id: string;
  seasonality: string;
  survey_name: string;
  survey_abbreviation: string;
  measure_data_type: string;
  commerce_industry?: string;
  occupation?: string;
  cps_labor_force_status?: string;
  demographic_age?: string;
  demographic_ethnic_origin?: string;
  demographic_race?: string;
  demographic_gender?: string;
  demographic_education?: string;
  area?: string;
  item?: string;
};

const ZodBls = schemaForType<BlsResponse<BlsReportSeries>>()(
  z.object({
    status: z.string(),
    responseTime: z.number(),
    message: z.array(z.string()),
    Results: z.object({
      series: z.array(
        z.object({
          seriesID: z.string(),
          catalog: z.object({
            series_title: z.string(),
            series_id: z.string(),
            seasonality: z.string(),
            survey_name: z.string(),
            survey_abbreviation: z.string(),
            measure_data_type: z.string(),
            commerce_industry: z.string().optional(),
            occupation: z.string().optional(),
            cps_labor_force_status: z.string().optional(),
            demographic_age: z.string().optional(),
            demographic_ethnic_origin: z.string().optional(),
            demographic_race: z.string().optional(),
            demographic_gender: z.string().optional(),
            demographic_education: z.string().optional(),
            area: z.string().optional(),
            item: z.string().optional(),
          }),
          data: z.array(
            z.object({
              year: z.string(),
              period: z.string(),
              periodName: z.string(),
              latest: z.string(),
              value: z.string(),
            })
          ),
        })
      ),
    }),
  })
);

export const depatmentOfLabor = createTRPCRouter({
  getBlsReports: publicProcedure.output(ZodBls).query(async () => {
    const blsResponse = await getPopularReports();
    return blsResponse;
  }),
});

const getPopularReports = async (): Promise<BlsResponse<BlsReportSeries>> => {
  const getCurrentPopularSeariesIds = await fetch(
    /**
     * env variables type as string | undefined
     * TODO investigaste why zod is showig undefined
     */
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    `${serverEnv.DOL_BASE_URL!}/timeseries/popular?registrationkey=${serverEnv.DOL_API_SHARED_SECRET!}}`
  );
  const currentPopularSeariesIds =
    (await getCurrentPopularSeariesIds.json()) as BlsResponse<BlsPopularSeries>;
  const seariesIds = currentPopularSeariesIds.Results.series.map(
    (item: BlsPopularSeries) => item.seriesID
  );

  const currDate = new Date();
  const currYear = currDate.getFullYear();
  const seriesReportData = await fetch("timeseries/data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      seriesid: seariesIds,
      startyear: currYear - 11,
      endyear: currYear,
      catalog: true,
      registrationkey: serverEnv.DOL_API_SHARED_SECRET,
    }),
  });
  const data = (await seriesReportData.json()) as BlsResponse<BlsReportSeries>;
  return data;
};
