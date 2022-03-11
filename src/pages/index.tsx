import type { NextPage } from "next";
import Head from "next/head";
import { Layout } from "src/components/layout";
import { SomedayTodo } from "src/components/SomedayTodo";
import { TodayTodo } from "src/components/TodayTodo";
import { TomorrowTodo } from "src/components/TomorrowTodo";

const Home: NextPage = () => {
  return (
    <Layout>
      <Head>
        <title>Home</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex flex-col justify-between items-center py-[144px] px-[81px] space-y-4 w-full min-h-full bg-white sm:flex-row sm:items-start sm:space-y-0 sm:space-x-4">
        <TodayTodo />
        <TomorrowTodo />
        <SomedayTodo />
      </div>
    </Layout>
  );
};

export default Home;
