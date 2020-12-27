import Head from 'next/head';

import Home from '../components/home/Home';

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
