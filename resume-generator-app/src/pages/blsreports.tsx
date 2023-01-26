import { type NextPage } from "next";
import Head from "next/head";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import superjson from "superjson";
import { appRouter } from "../server/api/root";
import { createInnerTRPCContext } from "../server/api/trpc";
import { api } from "../utils/api";

const BLSReports: NextPage<typeof getStaticProps> = (props) => {
  console.log("props", props);

  const { data } = api.depatmentOfLabor.getBlsReports.useQuery();
  return (
    <>
      <Head>
        <title>Popular BLS Reports</title>
        <meta
          name="Popular DOL Reports"
          content="Use the interface to generate a bullet for your resume"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div>
          Reports
          <ul>
            {data?.Results.series.map((item) => {
              return <li key={item.seriesID}>{item.catalog.series_title}</li>;
            })}
          </ul>
        </div>
      </main>
    </>
  );
};

export async function getStaticProps() {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({
      session: null,
    }),
    transformer: superjson, // optional - adds superjson serialization
  });

  await ssg.depatmentOfLabor.getBlsReports.prefetch();
  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
    revalidate: 1,
  };
}

export default BLSReports;
/**
 * <AreaChart
  width={730}
  height={250}
  data={rangeData}
  margin={{
    top: 20, right: 20, bottom: 20, left: 20,
  }}
>
  <XAxis dataKey="day" />
  <YAxis />
  <Area dataKey="temperature" stroke="#8884d8" fill="#8884d8" />
  <Tooltip />
</AreaChart>
import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import {
  GetStaticPaths,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next';
import { prisma } from 'server/context';
import { appRouter } from 'server/routers/_app';
import superjson from 'superjson';
import { trpc } from 'utils/trpc';
export async function getStaticProps(
  context: GetStaticPropsContext<{ id: string }>,
) {
  const ssg = await createProxySSGHelpers({
    router: appRouter,
    ctx: {},
    transformer: superjson, // optional - adds superjson serialization
  });
  const id = context.params?.id as string;
  // prefetch `post.byId`
  await ssg.post.byId.prefetch({ id });
  return {
    props: {
      trpcState: ssg.dehydrate(),
      id,
    },
    revalidate: 1,
  };
}


*/
