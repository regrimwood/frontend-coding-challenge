import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Typography from "../components/Typography";
import useGetEvents from "../utils/hooks/useGetEvents";
import EventCard from "../components/EventCard";
import { AnimatePresence, motion } from "framer-motion";
import Spinner from "../assets/icons/spinner.svg";
import useResizeObserver from "../utils/hooks/useResizeObserver";

const variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { ease: "easeInOut", duration: 0.5, staggerChildren: 0.1 },
  },
  exit: { opacity: 0, y: 0 },
};

function Transition({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
      transition={{ ease: "easeInOut", duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const Home: NextPage = () => {
  const { events, loading } = useGetEvents();
  const { ref, clientHeight } = useResizeObserver();

  return (
    <>
      <Head>
        <title>iTICKET</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="w-full min-h-screen pt-[40vh] pb-36 px-10 bg-black bg-gradient-to-br from-neonBlue from-10% via-violet via-30% to-black to-50%">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ ease: "easeInOut", duration: 0.5 }}
          >
            <Typography
              variant="h1"
              className="text-transparent bg-gradient-to-r from-lightPurple to-white bg-clip-text"
            >
              Upcoming Events
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ ease: "easeInOut", duration: 0.5, delay: 0.2 }}
          >
            <motion.div
              animate={{ height: clientHeight }}
              className="rounded-xl bg-white bg-opacity-75 mix-blend-plus-lighter mt-5 border-[1px] border-opacity-75 border-lightPurple"
            >
              <div ref={ref} className="p-10">
                <AnimatePresence mode="wait">
                  {loading && (
                    <Transition
                      key="loading"
                      className="flex items-center justify-center h-36"
                    >
                      <Spinner class="text-violet" />
                    </Transition>
                  )}
                  {!loading && events.length > 0 && (
                    <Transition key="events">
                      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {events.map((event) => (
                          <motion.li
                            key={event.id}
                            className="block"
                            variants={variants}
                          >
                            <EventCard event={event} />
                          </motion.li>
                        ))}
                      </ul>
                    </Transition>
                  )}
                  {!loading && events.length === 0 && (
                    <Transition
                      key="no-events"
                      className="flex items-center justify-center h-96"
                    >
                      <Typography variant="h2">No events found</Typography>
                    </Transition>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
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
