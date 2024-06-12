import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Typography from "../components/Typography";
import useGetEvents from "../utils/hooks/useGetEvents";
import EventCard from "../components/EventCard";

const Home: NextPage = () => {
  const { events, loading } = useGetEvents();

  return (
    <>
      <Head>
        <title>iTICKET</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-full min-h-screen pt-[40vh] pb-36 px-10 bg-black bg-gradient-to-br from-neonBlue from-10% via-violet via-30% to-black to-50%">
        <div className="max-w-6xl mx-auto">
          <Typography
            variant="h1"
            className="text-transparent bg-gradient-to-r from-lightPurple to-white bg-clip-text"
          >
            Upcoming Events
          </Typography>

          <div className="rounded-lg bg-white bg-opacity-75 mix-blend-plus-lighter p-10 mt-5">
            <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {events.length > 0 &&
                events.map((event) => <EventCard event={event} />)}
            </ul>
          </div>
        </div>
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
