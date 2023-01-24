import { type NextPage } from "next";
import Head from "next/head";
import ResumeBulletGenerator from "../components/ResumeBullet";

const ResumeBuilder: NextPage = () => {
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta
          name="resumegenerator"
          content="Use the interface to generate a bullet for your resume"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <ResumeBulletGenerator />
      </main>
    </>
  );
};

export default ResumeBuilder;
