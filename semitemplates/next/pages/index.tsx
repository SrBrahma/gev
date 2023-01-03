import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import { generateData } from '../api/generateData';

type Props = {
  myData: number[];
};

export default function Home({}: Props) {
  return (
    <>
      <Head>
        <title>{'My Next Project'}</title>
      </Head>
      <p>{'Hi!'}</p>
    </>
  );
}

// https://stackoverflow.com/a/65760948
// eslint-disable-next-line
export const getServerSideProps: GetServerSideProps<Props> = async () => {
  return {
    props: {
      myData: generateData({ number: 5 }),
    },
  };
};
