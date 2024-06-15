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

interface Props {
  event?: EventModel;
}

function Event(props: Props) {
  const { event } = props;
  // notFound from getStaticProps triggers
  if (!event) {
    return null;
  }

  const [imageError, setImageError] = useState<boolean>(false);
  const [subtitle, setSubtitle] = useState<string>("");

  const { name, imageUrl } = event;
  const { md, lg } = tailwindConfig.theme.screens;

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
            transition={{ ease: "easeInOut", duration: 0.5, delay: 0.2 }}
          >
            <div className="p-6 md:p-10 rounded-xl bg-white bg-opacity-75 mix-blend-plus-lighter mt-5 border-[1px] border-opacity-75 border-lightPurple">
              <div className="flex justify-between flex-col md:flex-row md:gap-20 mb-10">
                <div>
                  <Typography variant="h1" className="mb-5">
                    {event.name}
                  </Typography>
                  <Typography variant="h3">{subtitle}</Typography>
                </div>
                <div className="relative w-1/2 aspect-square bg-white rounded-lg overflow-hidden">
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
