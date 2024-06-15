import Head from "next/head";
import { GetStaticPaths, GetStaticProps } from "next";
import { motion } from "framer-motion";
import { REVALIDATE_PAGES } from "utils/globals";
import { EventModel } from "utils/models/EventModel";
import getEvent from "utils/queries/getEvent";
import Typography from "../../components/Typography";
import Main from "../../components/Main";
import { useState } from "react";
import Image from "next/image";
import tailwindConfig from "tailwind.config";
import GAEventDetails from "@/components/GAEventDetails";
import useResizeObserver from "utils/hooks/useResizeObserver";

interface Props {
  event?: EventModel;
}

function Event(props: Props) {
  const { event } = props;
  // notFound from getStaticProps triggers
  if (!event) {
    return null;
  }

  const { name, imageUrl } = event;
  const { md, lg } = tailwindConfig.theme.screens;

  const { ref, clientHeight } = useResizeObserver();

  const [imageError, setImageError] = useState<boolean>(false);
  const [subtitle, setSubtitle] = useState<string>("");

  return (
    <>
      <Head>
        <title>iTICKET | {event.name}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Main>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ ease: "easeInOut", duration: 0.5, delay: 0.2 }}
          >
            <motion.div
              animate={{ height: clientHeight }}
              className="rounded-xl bg-white bg-opacity-75 mix-blend-plus-lighter border-[1px] border-opacity-75 border-lightPurple"
            >
              <div ref={ref} className="p-6 md:p-10">
                <div className="flex justify-between flex-col md:flex-row gap-7 md:gap-20 mb-7 md:mb-10">
                  <div>
                    <Typography variant="h1" className="mb-5">
                      {event.name}
                    </Typography>
                    <Typography variant="h3">{subtitle}</Typography>
                  </div>
                  <div className="relative w-full md:w-1/2 aspect-square bg-white rounded-lg overflow-hidden">
                    <Image
                      className="absolute"
                      src={imageError ? "/iTICKET.svg" : imageUrl}
                      alt={name}
                      fill
                      style={{ objectFit: "contain" }}
                      onError={() => setImageError(true)}
                      sizes={`(max-width: ${md}) 100vw, (max-width: ${lg}) 50vw, 40rem`}
                    />
                  </div>
                </div>
                <GAEventDetails event={event} setSubtitle={setSubtitle} />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </Main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = `${params?.event}`;

  const event = await getEvent({
    id: slug,
  });

  const props: Props = {
    event,
  };

  return {
    props: { ...props, key: slug },
    revalidate: REVALIDATE_PAGES,
    notFound: !event,
  };
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [],
  fallback: "blocking",
});

export default Event;
