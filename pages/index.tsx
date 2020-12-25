import {useEffect, useRef} from 'react';

import Head from 'next/head';

import styles from '../styles/Home.module.scss';

const Home = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    init();
  }, [videoRef]);

  const init = async () => {
    if (!videoRef?.current) {
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      return;
    }

    const stream: MediaStream = await navigator.mediaDevices.getUserMedia({audio: false, video: {width: 1280, height: 720}});

    const video: HTMLVideoElement = (videoRef.current as unknown) as HTMLVideoElement;

    video.srcObject = stream;
    await video.play();
  };

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        Hello World
        <video ref={videoRef}></video>
      </main>
    </>
  );
};

export default Home;
