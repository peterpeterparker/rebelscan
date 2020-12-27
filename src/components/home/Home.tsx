import {useEffect, useRef} from 'react';

import styles from './Home.module.scss';

import {useSize} from '../../hooks/size.hook';

const Home = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const scanRef = useRef<HTMLCanvasElement | null>(null);

  const videoSize = useSize();

  useEffect(() => {
    if (!scanRef?.current || !videoRef.current || !videoSize) {
      return;
    }

    init();
  }, [videoRef, scanRef, videoSize]);

  const init = async () => {
    if (!videoRef?.current || !videoSize) {
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      return;
    }

    // TODO: handle resize
    const stream: MediaStream = await navigator.mediaDevices.getUserMedia({audio: false, video: {width: videoSize.width, height: videoSize.height}});

    const video: HTMLVideoElement = (videoRef.current as unknown) as HTMLVideoElement;

    if (video.srcObject) {
      return;
    }

    video.srcObject = stream;
    await video.play();

    requestAnimationFrame(streamFeed);
  };

  const streamFeed = () => {
    if (!scanRef?.current || !videoRef.current) {
      return;
    }

    if (videoRef.current.paused || videoRef.current.ended) {
      return;
    }

    if (!videoSize) {
      return;
    }

    const y = videoSize.height * 0.6;
    const x = (y * 210) / 297;

    const deltaX = (videoSize.width - x) / 2;
    const deltaY = (videoSize.height - y) / 2;

    scanRef.current.width = 2100;
    scanRef.current.height = 2970;

    console.log(deltaX, deltaY, x, y);

    const context = scanRef.current.getContext('2d');
    context?.drawImage(videoRef.current, deltaX, deltaY, x, y, 0, 0, 2100, 2970);

    requestAnimationFrame(streamFeed);
  };

  return (
    <main className={styles.main}>
      <video className={styles.video} ref={videoRef} width={videoSize?.width} height={videoSize?.height}></video>

      <div className={styles.overlay}></div>

      <canvas ref={scanRef} className={styles.scan}></canvas>
    </main>
  );
};

export default Home;
