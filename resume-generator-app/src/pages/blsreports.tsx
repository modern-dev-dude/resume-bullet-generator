import { type NextPage } from "next";
import Head from "next/head";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import superjson from "superjson";
import { appRouter } from "../server/api/root";
import { createInnerTRPCContext } from "../server/api/trpc";
import { api } from "../utils/api";
import { Listbox, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/24/outline";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const BLSReports: NextPage<typeof getStaticProps> = () => {
  const { data } = api.depatmentOfLabor.getBlsReports.useQuery();
  const [selectedReport, setSelectedReport] = useState("");
  console.log(data);
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
        <div className="flex flex-col">
          <div className="h-1/3 w-full md:w-2/5 ">
            <Listbox value={selectedReport} onChange={setSelectedReport}>
              <div className="relative mt-1">
                <h4 className="text-lg font-medium">Select report:</h4>
                <Listbox.Button className="relative h-12 w-full cursor-default rounded-lg bg-white px-4 text-left shadow-lg focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                  <span className="block truncate">{selectedReport}</span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options className="absolute z-10 mt-1 max-h-72 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {data?.Results.series.map((blsItem) => (
                      <Listbox.Option
                        key={blsItem.seriesID}
                        value={blsItem.catalog.series_title}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active
                              ? "bg-amber-100 text-amber-900"
                              : "text-gray-900"
                          }`
                        }
                      >
                        {({ selected }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {blsItem.catalog.series_title}
                            </span>
                            {selected ? (
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Listbox.Option>
                    ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>
          <div className="mt-4 h-1/3 w-full md:w-2/5">
            <ResponsiveContainer>
              <AreaChart
                data={data?.Results.series
                  .find(
                    (report) => report.catalog.series_title === selectedReport
                  )
                  ?.data?.sort((a, b) => Number(a.year) - Number(b.year))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="periodName" />
                <YAxis />
                <Area dataKey="value" stroke="#8884d8" fill="#8884d8" />
                <Tooltip />
              </AreaChart>
            </ResponsiveContainer>
          </div>
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
