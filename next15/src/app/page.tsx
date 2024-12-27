"use client";
import type { NextPage } from "next";
import dynamic from "next/dynamic";

const Content = dynamic(() => import("./content"), { ssr: false });

const Page: NextPage = () => {
  return (
    <main className="flex flex-col justify-center items-center p-16 w-full h-full">
      <Content />
    </main>
  );
};

export default Page;
