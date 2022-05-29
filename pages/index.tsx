import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

const Home: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>iTICKET</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to the{" "}
          <a
            className="text-emerald-500"
            href="https://github.com/iticketnz/frontend-coding-challenge"
          >
            iTICKET frontend coding challenge!
          </a>
        </h1>

        <p className="mt-3 text-2xl">
          Get started by editing{" "}
          <code className="rounded-md bg-gray-100 p-3 font-mono text-lg">
            pages/index.tsx
          </code>
        </p>

        <p className="mt-3 text-2xl">
          If you haven't already:{" "}
          <a
            className="text-emerald-500"
            href="https://github.com/iticketnz/frontend-coding-challenge/blob/main/README.md"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read the README
          </a>
        </p>
      </main>

      <footer className="flex h-24 w-full items-center justify-center border-t">
        <a
          href="https://www.iticket.co.nz/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image src="/iTICKET.svg" alt="iTICKET Logo" width={32} height={32} />
        </a>
      </footer>
    </div>
  );
};

export default Home;
