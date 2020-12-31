import Head from 'next/head';

const Header = () => {
  return (
    <Head>
      <title>Rebel Scan</title>

      <meta property="og:site_name" content="Rebel Scan" />
      <meta property="og:title" content="It is just little scanner app made with the web, you rebel scum!" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://rebelscan.com" />
      <meta property="og:image" content="https://rebelscan.com/meta/rebelscan-meta.png" />
      <meta property="og:image:type" content="image/png" />

      <meta name="twitter:site" content="@daviddalbusco" />
      <meta name="twitter:creator" content="@daviddalbusco" />
      <meta name="twitter:title" content="Rebel Scan" />
      <meta name="twitter:description" content="It is just little scanner app made with the web, you rebel scum!" />
      <meta name="twitter:image:src" content="https://rebelscan.com/meta/rebelscan-meta.png" />
      <meta name="twitter:card" content="summary_large_image" />

      <meta name="author" content="David Dal Busco" />

      <meta name="description" content="It is just little scanner app made with the web, you rebel scum!" />
      <meta property="og:description" content="It is just little scanner app made with the web, you rebel scum!" />

      <link rel="canonical" href="https://rebelscan.com" />

      <base href="/" />

      <meta name="viewport" content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />

      <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
      <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#004e64" />
      <meta name="msapplication-TileColor" content="#00a5cf" />
      <meta name="theme-color" content="#000501" />

      <link rel="manifest" href="/site.webmanifest" />
    </Head>
  );
};

export default Header;
