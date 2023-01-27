import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Analytics } from "@vercel/analytics/react";
import { api } from "../utils/api";

import "../styles/globals.css";
import LayoutWrapper from "../components/LayoutWrapper";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <LayoutWrapper>
        <Component {...pageProps} />
        <Analytics />
      </LayoutWrapper>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
