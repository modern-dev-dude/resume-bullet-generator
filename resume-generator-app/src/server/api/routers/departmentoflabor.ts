import { z } from "zod";
import { serverEnv } from "../../../env/schema.mjs";
import type { BlsResponse, BlsSeriesListResponse } from "../../../types/BlsApi";
import { Period, PeriodName, Seasonality } from "../../../types/BlsApi";
import { schemaForType } from "../../../types/tRPC_Utils";
import { createTRPCRouter, publicProcedure } from "../trpc";

const ZodBls = schemaForType<BlsResponse>()(
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
            seasonality: z.nativeEnum(Seasonality).optional(),
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
              period: z.nativeEnum(Period),
              periodName: z.nativeEnum(PeriodName),
              latest: z.string().optional(),
              value: z.string(),
              footnotes: z.array(
                z.object({
                  code: z.string().optional(),
                  text: z.string().optional(),
                })
              ),
            })
          ),
        })
      ),
    }),
  })
);

export const depatmentOfLabor = createTRPCRouter({
  getBlsReports: publicProcedure
    .input(z.undefined())
    .output(ZodBls)
    .query(async () => {
      const blsResponse = await getPopularReports();
      return blsResponse;
    }),
});

const getPopularReports = async (): Promise<BlsResponse> => {
  const getCurrentPopularSeariesIds = await fetch(
    /**
     * env variables type as string | undefined
     * TODO investigaste why zod is showig undefined
     */
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    `${serverEnv.DOL_BASE_URL!}/timeseries/popular?registrationkey=${serverEnv.DOL_API_SHARED_SECRET!}`
  );
  const currentPopularSeariesIds =
    (await getCurrentPopularSeariesIds.json()) as BlsSeriesListResponse;

  const seariesIds = currentPopularSeariesIds.Results.series.map(
    (item) => item.seriesID
  );

  const currDate = new Date();
  const currYear = currDate.getFullYear();
  const seriesReportData = await fetch(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    `${serverEnv.DOL_BASE_URL!}/timeseries/data`,
    {
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
    }
  );
  const data = (await seriesReportData.json()) as BlsResponse;
  return data;
};
