import Head from 'next/head';

import dynamic from 'next/dynamic';

const Home = dynamic(() => import('../components/home/Home'), {ssr: false});

const Index = () => {
  return (
    <>
      <Head>
        <title>Create Next App</title>

        <meta name="viewport" content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />

        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#004e64" />
        <meta name="msapplication-TileColor" content="#00a5cf" />
        <meta name="theme-color" content="#000501" />

        <link rel="manifest" href="/site.webmanifest" />
      </Head>

      <Home></Home>
    </>
  );
};

export default Index;
