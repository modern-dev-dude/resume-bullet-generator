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
  Legend,
} from "recharts";

const BLSReports: NextPage<typeof getStaticProps> = () => {
  const { data } = api.depatmentOfLabor.getBlsReports.useQuery();
  const [selectedReport, setSelectedReport] = useState("");
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
                <div className="flex flex-col ">
                  <h4 className="text-lg font-medium">Select report :</h4>
                  {selectedReport.length === 0 && (
                    <span className="text-sm italic">
                      (use the dropdown to show a chart)
                    </span>
                  )}
                </div>
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

          {selectedReport.length > 0 && (
            <div
              className="mt-4 w-full md:w-3/5"
              style={{
                width: "80vw",
                height: "60vh",
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data?.Results.series
                    .find(
                      (report) => report.catalog.series_title === selectedReport
                    )
                    ?.data?.sort((a, b) => Number(a.year) - Number(b.year))}
                  margin={{
                    top: 24,
                    right: 30,
                    left: -20,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Area dataKey="value" stroke="#155e75" fill="#67e8f9" />
                  <Tooltip />
                  <Legend
                    verticalAlign="top"
                    height={55}
                    formatter={() => {
                      const item = data?.Results.series.find(
                        (report) =>
                          report.catalog.series_title === selectedReport
                      );
                      return (
                        <span>
                          {item?.catalog.series_title},
                          {item?.catalog.demographic_age}
                        </span>
                      );
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
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
    revalidate: 60 * 60 * 24,
  };
}

export default BLSReports;
