import {CSSProperties, useEffect, useRef, useState} from 'react';

import {defineCustomElements} from 'web-photo-filter/dist/loader';
defineCustomElements();

import {WebPhotoFilter} from 'web-photo-filter-react/dist';

import {isIOS} from '@deckdeckgo/utils';

import styles from './Home.module.scss';

import {InfoSize, useScreenSize} from '../../hooks/size.hook';

import {savePdf} from '../../utils/pdf.utils';
import {shareImage} from '../../utils/image.utils';

import Toolbar from '../toolbar/Toolbar';

const Home = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const scanRef = useRef<HTMLCanvasElement | null>(null);

  const containerRef = useRef<HTMLElement | null>(null);

  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);

  const [videoSize, setVideoSize] = useState<InfoSize | undefined>(undefined);

  const [status, setStatus] = useState<'scan' | 'share' | 'capture'>('scan');

  const [captureSrc, setCaptureSrc] = useState<string | undefined>(undefined);
  const [captureDest, setCaptureDest] = useState<string | undefined>(undefined);

  const screenSize = useScreenSize();

  const [canvasHeight, setCanvasHeight] = useState<number | undefined>(undefined);
  const [videoStyle, setVideoStyle] = useState<CSSProperties | undefined>(undefined);
  const canvasPadding: number = 64;

  const iOS: boolean = isIOS();

  useEffect(() => {
    if (!scanRef?.current || !videoRef?.current || !containerRef?.current) {
      return;
    }

    if (videoSize) {
      return;
    }

    // https://webkit.org/blog/6784/new-video-policies-for-ios/
    if (iOS) {
      return;
    }

    init();
  }, [videoRef, scanRef, containerRef]);

  useEffect(() => {
    if (!videoSize) {
      return;
    }

    scan();
  }, [videoSize]);

  useEffect(() => {
    if (!videoSize || !containerRef?.current) {
      return;
    }

    setVideoStyle({
      '--video-height': videoSize.width > videoSize.height ? '100%' : `${containerRef.current.offsetHeight + canvasPadding * 2}px`,
      '--video-max-height': videoSize.width > videoSize.height ? `calc((100vw - (${canvasPadding}px / 2)) / 210 * 297)` : 'inherit',
      '--video-max-width': videoSize.width > videoSize.height ? 'inherit' : `calc(100vw - (${canvasPadding}px * (${videoSize.width} / ${videoSize.height})))`,
    } as CSSProperties);

    scan();
  }, [videoSize, containerRef]);

  useEffect(() => {
    setVideoLoaded(videoStyle !== undefined);
  }, [videoStyle]);

  useEffect(() => {
    setCanvasHeight(containerRef?.current?.offsetHeight ? containerRef.current.offsetHeight - canvasPadding : undefined);
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
        width: {ideal: 1920},
        height: {ideal: 1080},
        facingMode: 'environment',
      },
    });

    const [track] = stream.getVideoTracks();

    if (!track) {
      return;
    }

    // If flash would be required
    // const capabilities = track.getCapabilities();
    //
    // if ((capabilities as any).torch) {
    //   await track.applyConstraints({
    //     advanced: [{torch: true} as any],
    //   });
    // }

    // To setup a special phone capabilities
    // const capabilities = track.getCapabilities();
    // if ((capabilities as any).iso) {
    //   await track.applyConstraints({
    //     advanced: [
    //       {
    //         iso: 500,
    //       } as any,
    //     ],
    //   });
    // }

    const settings = track.getSettings();

    const videoSize = {
      width: settings.width as number,
      height: settings.height as number,
    };

    const video: HTMLVideoElement = (videoRef.current as unknown) as HTMLVideoElement;

    if (video.srcObject) {
      return;
    }

    video.srcObject = stream;

    video.width = videoSize.width;
    video.height = videoSize.height;

    await video.play();

    setVideoSize(videoSize);
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

    // We get landscape
    let y: number = videoSize.height - canvasPadding;
    let x: number = (y * 210) / 297;

    const maxWidth: number = videoSize.width - canvasPadding;

    if (x > maxWidth) {
      // We might receive portrait and calculated width might be therefore bigger than effective video width.
      x = maxWidth;
      y = (x * 297) / 210;
    }

    const deltaX: number = (videoSize.width - x) / 2;
    const deltaY: number = (videoSize.height - y) / 2;

    scanRef.current.width = 2100;
    scanRef.current.height = 2970;

    const context = scanRef.current.getContext('2d');
    context?.drawImage(videoRef.current, deltaX, deltaY, x, y, 0, 0, 2100, 2970);

    scan();
  };

  const scan = () => {
    requestAnimationFrame(streamFeed);
  };

  const capture = async () => {
    const video: HTMLVideoElement = (videoRef.current as unknown) as HTMLVideoElement;

    if (status === 'scan') {
      await video.pause();

      setStatus('capture');
      return;
    }

    await video.play();
    scan();

    setStatus('scan');
  };

  useEffect(() => {
    if (status === 'capture') {
      // Delay render blocking action
      setTimeout(() => setCaptureSrc(scanRef?.current?.toDataURL('image/png')), 250);
      return;
    }

    setCaptureSrc(undefined);
  }, [status]);

  const share = async () => {
    if (!captureDest) {
      return;
    }

    await shareImage(captureDest);
  };

  const download = async () => {
    if (!captureDest) {
      return;
    }

    await savePdf(captureDest);
  };

  const imageLoaded = ($event: {detail: {webGLDetected: boolean; result: HTMLCanvasElement | HTMLImageElement}}) => {
    if (!$event.detail.webGLDetected) {
      setCaptureDest(undefined);
      setStatus('scan');
      return;
    }

    setCaptureDest(($event.detail.result as HTMLCanvasElement).toDataURL('image/png'));
    setStatus('share');
  };

  return (
    <main className={styles.main}>
      <article ref={containerRef} className={styles.container}>
        <video className={styles.video} ref={videoRef} style={videoStyle} muted={true} autoPlay={!iOS} playsInline={true}></video>

        <div className={styles.overlay}></div>

        {renderCanvas()}
      </article>

      <Toolbar videoLoaded={videoLoaded} status={status} download={download} capture={capture} share={share} init={init}></Toolbar>
    </main>
  );

  function renderCanvas() {
    const canvasStyle = canvasHeight
      ? ({
          '--canvas-height': `${canvasHeight}px`,
          '--canvas-padding': `${canvasPadding}px`,
        } as CSSProperties)
      : undefined;

    return (
      <>
        <WebPhotoFilter
          onFilterLoad={($event: any) => imageLoaded($event)}
          src={captureSrc}
          filter="desaturate,saturation,contrast"
          className={`${styles.scan} ${styles.filter} ${status === 'scan' || videoSize === undefined ? 'hidden' : 'show'}`}
          style={canvasStyle}
        />
        <canvas ref={scanRef} className={`${styles.scan} ${status === 'share' || videoSize === undefined ? 'hidden' : 'show'}`} style={canvasStyle}></canvas>

        {!videoLoaded && !iOS ? <h1 className={styles.loading}>Loading...</h1> : undefined}

        {!videoLoaded && iOS ? <h1 className={styles.loading}>Hit Play!</h1> : undefined}
      </>
    );
  }
};

export default Home;
