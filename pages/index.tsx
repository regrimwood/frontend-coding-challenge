import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Typography from "../components/Typography";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>iTICKET</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-full min-h-screen pt-[50vh] px-10 bg-black bg-gradient-to-br from-neonBlue from-10% via-violet via-30% to-black to-50%">
        <Typography
          variant="h1"
          className="text-transparent bg-gradient-to-r from-lightPurple to-white bg-clip-text"
        >
          Upcoming Events
        </Typography>
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
    </>
  );
};

export default Home;
