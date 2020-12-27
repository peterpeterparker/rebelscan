import Head from 'next/head';

import dynamic from 'next/dynamic';

const Home = dynamic(() => import('../components/home/Home'), {ssr: false});

const Index = () => {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Home></Home>
    </>
  );
};

export default Index;
