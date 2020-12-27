import {CSSProperties, useEffect, useRef, useState} from 'react';

import styles from './Home.module.scss';

import {ScreenSize, useScreenSize} from '../../hooks/size.hook';

const Home = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const scanRef = useRef<HTMLCanvasElement | null>(null);

  const screenSize = useScreenSize();

  let videoSize: ScreenSize | undefined = undefined;

  const [canvasHeight, setCanvasHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (!scanRef?.current || !videoRef.current || !canvasHeight) {
      return;
    }

    init();
  }, [videoRef, scanRef, canvasHeight]);

  useEffect(() => {
    if (!screenSize) {
      return;
    }

    setCanvasHeight(((screenSize.height * 210) / 297 > screenSize.width ? (screenSize.width / 210) * 297 : screenSize.height) * 0.8);
  }, [screenSize]);

  const init = async () => {
    if (!videoRef?.current) {
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      return;
    }

    const stream: MediaStream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: {
        width: {ideal: 720},
        height: {ideal: 1280},
      },
    });

    if (!stream.getVideoTracks()[0]?.getSettings().width || !stream.getVideoTracks()[0]?.getSettings().height) {
      return;
    }

    videoSize = {
      width: stream.getVideoTracks()[0].getSettings().width as number,
      height: stream.getVideoTracks()[0].getSettings().height as number,
    };

    const video: HTMLVideoElement = (videoRef.current as unknown) as HTMLVideoElement;

    if (video.srcObject) {
      return;
    }

    video.srcObject = stream;

    video.width = videoSize.width;
    video.height = videoSize.height;

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

    if (!videoSize || !canvasHeight) {
      return;
    }

    const y = canvasHeight;
    const x = (y * 210) / 297;

    const deltaX = (videoSize.width - x) / 2;
    const deltaY = (videoSize.height - y) / 2;

    scanRef.current.width = 2100;
    scanRef.current.height = 2970;

    const context = scanRef.current.getContext('2d');
    context?.drawImage(videoRef.current, deltaX, deltaY, x, y, 0, 0, 2100, 2970);

    requestAnimationFrame(streamFeed);
  };

  const canvasStyle = {'--canvas-height': `${canvasHeight}px`} as CSSProperties;

  return (
    <main className={styles.main}>
      <video className={styles.video} ref={videoRef}></video>

      <div className={styles.overlay}></div>

      <canvas ref={scanRef} className={styles.scan} style={canvasStyle}></canvas>
    </main>
  );
};

export default Home;
