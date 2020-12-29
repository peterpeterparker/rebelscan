import Head from 'next/head';

import dynamic from 'next/dynamic';

const Home = dynamic(() => import('../components/home/Home'), {ssr: false});

const Index = () => {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />

        <meta name="viewport" content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Head>

      <Home></Home>
    </>
  );
};

export default Index;
