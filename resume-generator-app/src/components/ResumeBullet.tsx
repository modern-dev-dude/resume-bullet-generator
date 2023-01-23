import { useState } from "react";
import { api } from "../utils/api";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import type { GetResumeBulletResponse } from "../types/tRPC_Utils";

export default function ResumeBulletGenerator() {
  return (
    <div className="flex flex-col gap-4">
      <ResumeTextField />
    </div>
  );
}

type TextFieldOnChange =
  | React.ChangeEvent<HTMLInputElement>
  | React.ChangeEvent<HTMLTextAreaElement>;

function ResumeTextField() {
  const resumeBulletMutation = api.openai.getBullet.useMutation();
  const [resumeText, setResumeText] = useState<string>("");
  const handleTextChange = (e: TextFieldOnChange) => {
    const valueOfTarget = e.target.value;
    setResumeText(valueOfTarget);
  };

  const gernerateBullets = () => {
    resumeBulletMutation.mutate({ text: resumeText });
  };

  return (
    <div className="flex flex-col ">
      <label
        htmlFor="resumeTextField"
        className="block text-sm font-medium text-gray-700"
      >
        Enter some text to generate a resume bullet:
      </label>
      <div className="mt-1">
        <textarea
          id="resumeTextField"
          rows={6}
          className="block w-2/5 rounded-md border-gray-300 p-1 shadow-md focus:border-indigo-500 focus:ring-indigo-500  sm:text-sm"
          placeholder="developed full stack application with typescript, react, and node js that allows users to generate resume bullets with 1000 active daily users..."
          onChange={handleTextChange}
          value={resumeText}
        />
      </div>
      <div className="mt-1">
        <button
          onClick={gernerateBullets}
          type="button"
          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {resumeBulletMutation.isLoading && (
            <>
              <svg
                aria-hidden="true"
                role="status"
                className="mr-3 inline h-4 w-4 animate-spin text-white"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>
              <p>Loading...</p>
            </>
          )}
          {!resumeBulletMutation.isLoading && <p>Generate</p>}
        </button>
      </div>

      <RenderChoicesAsBulletPoints choices={resumeBulletMutation.data || []} />
    </div>
  );
}

type RenderChoicesProps = {
  choices: GetResumeBulletResponse;
};
function RenderChoicesAsBulletPoints({ choices }: RenderChoicesProps) {
  const handleClpboard = (resumeBulletText: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(resumeBulletText).then(
        () => {
          console.log("copy success");
        },
        (error) => {
          console.log(error);
        }
      );
    }
  };
  return (
    <>
      <div className="mt-6 flow-root">
        <ul role="list" className="w-2/3 divide-y divide-gray-200">
          {choices.map(({ text }) => (
            <li key={text} className="py-4 shadow">
              <div className="flex justify-between space-x-4">
                <p className="text-md whitespace-normal font-medium">{text}</p>
                <button
                  type="button"
                  onClick={() => handleClpboard(text ?? "")}
                >
                  <ArrowTopRightOnSquareIcon height={24} />
                  {/* Copy to clipboard */}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
