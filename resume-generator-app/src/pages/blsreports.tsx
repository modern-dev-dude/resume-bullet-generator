import { type NextPage } from "next";
import Head from "next/head";

const BLSReports: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta
          name="Popular DOL Reports"
          content="Use the interface to generate a bullet for your resume"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main></main>
    </>
  );
};

export function getStaticProps() {
  return {
    props: {
      // TODO add SSG logic
      // props for your component
    },
  };
}

export default BLSReports;
