/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "../utils/api";
import { useState } from "react";

const Home: NextPage = () => {
  const bullet = api.example.getBullet.useQuery({ text: "Write a resume bullet for node js, react, and typescript " });
  console.log(bullet)

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen items-center justify-center ">
        <div className="flex items-center justify-center gap-12 px-4 py-16 ">
            <TextField />
        </div>
        <div className="flex items-center justify-center gap-12 px-4 py-16 ">
          {bullet.data && <ul>{bullet.data.aiResponse.map(choice => <li key={choice.text}>{choice.text}</li>)}</ul>}
        </div>
      </main>
    </>
  );
};

export default Home;

type TextFieldOnChange =  React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>;

function TextField(){
  const [resumeText, setResumeText] = useState<string>('')
  const handleTextChange = (e:TextFieldOnChange) => {
      const valueOfTarget = e.target.value;
      setResumeText(valueOfTarget);
  }
  return(
    <div>
      <label htmlFor="resumeTextField" className="block text-sm font-medium text-gray-700">
        Enter some text to generate a resume bullet:
      </label>
      <div className="mt-1">
        <textarea
          id="resumeTextField"
          rows={6}          
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm  p-1"
          placeholder="developed a notification application..."
          onChange={handleTextChange}
          value={resumeText}
        />
      </div>
      <div className="mt-1">
      <button
        type="button"
        className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Generate
      </button>
    </div>
    </div>
  )
}

// const AuthShowcase: React.FC = () => {
//   const { data: sessionData } = useSession();

//   // const { data: secretMessage } = api.example.getSecretMessage.useQuery(
//   //   undefined, // no input
//   //   { enabled: sessionData?.user !== undefined },
//   // );

//   return (
//     <div className="flex flex-col items-center justify-center gap-4">
//       <p className="text-center text-2xl text-white">
//         {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
//         {secretMessage && <span> - {secretMessage}</span>}
//       </p>
//       <button
//         className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
//         onClick={sessionData ? () => void signOut() : () => void signIn()}
//       >
//         {sessionData ? "Sign out" : "Sign in"}
//       </button>
//     </div>
//   );
// };
