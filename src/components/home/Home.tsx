import {useEffect, useRef} from 'react';

import styles from './Home.module.scss';

import {useSize} from '../../hooks/size.hook';

const Home = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const scanRef = useRef<HTMLCanvasElement | null>(null);

  const videoSize = useSize();

  useEffect(() => {
    if (!scanRef?.current || !videoRef.current) {
      return;
    }

    videoRef.current?.addEventListener('play', () => requestAnimationFrame(streamFeed), {once: true});

    init();
  }, [videoRef, scanRef]);

  const init = async () => {
    if (!videoRef?.current) {
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      return;
    }

    const stream: MediaStream = await navigator.mediaDevices.getUserMedia({audio: false, video: true});

    const video: HTMLVideoElement = (videoRef.current as unknown) as HTMLVideoElement;

    video.srcObject = stream;
    await video.play();
  };

  const streamFeed = () => {
    if (!scanRef?.current || !videoRef.current) {
      return;
    }

    if (videoRef.current.paused || videoRef.current.ended) {
      return;
    }

    const context = scanRef.current.getContext('2d');
    context?.drawImage(videoRef.current, 0, 0, 210, 297);

    requestAnimationFrame(streamFeed);
  };

  return (
    <main className={styles.main}>
      <video className={styles.video} ref={videoRef} width={videoSize?.width} height={videoSize?.height}></video>

      <div className={styles.overlay}></div>

      <canvas ref={scanRef} className={styles.scan} width={210} height={297}></canvas>
    </main>
  );
};

export default Home;
