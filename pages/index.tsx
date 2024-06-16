import type { NextPage } from "next";
import Head from "next/head";
import Typography from "../components/Typography";
import useGetEvents from "../utils/hooks/useGetEvents";
import EventCard from "../components/EventCard";
import { AnimatePresence, motion } from "framer-motion";
import Spinner from "../assets/icons/spinner.svg";
import useResizeObserver from "../utils/hooks/useResizeObserver";
import Main from "../components/Main";
import Transition, {
  transitionVariants,
} from "../components/AnimationTransition";

const Home: NextPage = () => {
  // Get events using a hook because in production we would be filtering/paginating.
  const { events, loading } = useGetEvents();
  const { ref, clientHeight } = useResizeObserver();

  return (
    <>
      <Head>
        <title>iTICKET</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Main>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ ease: "easeInOut", duration: 0.5 }}
          >
            <Typography
              variant="headline"
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
              <div ref={ref} className="p-6 md:p-10">
                {/* I think AnimatePresence might have the same bug as react spring's useTransition where a quick state change will cause nothing to animate in.. */}
                {/* TODO: workaround? */}
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
                            variants={transitionVariants}
                          >
                            <EventCard event={event} />
                          </motion.li>
                        ))}
                      </ul>
                    </Transition>
                  )}
                  {!loading && events.length === 0 && (
                    <Transition key="no-events" className="h-96">
                      <Typography variant="h3">No events found!</Typography>
                    </Transition>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </Main>
    </>
  );
};

export default Home;
