import {CSSProperties, useEffect, useRef, useState} from 'react';

import Image from 'next/image';

import styles from './Home.module.scss';

import {InfoSize} from '../../hooks/size.hook';

import {getPdfFile, savePdf} from '../../utils/pdf.utils';

import {isMobile} from '@deckdeckgo/utils';

import {defineCustomElements} from 'web-photo-filter/dist/loader';
defineCustomElements();

import {WebPhotoFilter} from 'web-photo-filter-react/dist';

const Home = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const scanRef = useRef<HTMLCanvasElement | null>(null);

  const containerRef = useRef<HTMLElement | null>(null);

  const [videoSize, setVideoSize] = useState<InfoSize | undefined>(undefined);
  const [canvasHeight, setCanvasHeight] = useState<number | undefined>(undefined);

  const [status, setStatus] = useState<'scan' | 'share' | undefined>(undefined);

  const [captureSrc, setCaptureSrc] = useState<string | undefined>(undefined);
  const [captureDest, setCaptureDest] = useState<string | undefined>(undefined);

  // @ts-ignore
  const shareSupported: boolean = navigator.canShare;

  useEffect(() => {
    if (!scanRef?.current || !videoRef?.current || !containerRef?.current) {
      return;
    }

    init();
  }, [videoRef, scanRef, containerRef.current]);

  useEffect(() => {
    if (!videoSize || !canvasHeight) {
      return;
    }

    scan();
  }, [canvasHeight, videoSize]);

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
        ...(isMobile() && {facingMode: {exact: 'environment'}}),
      },
    });

    const [track] = stream.getVideoTracks();

    if (!track) {
      return;
    }

    // TODO: flash
    // const capabilities = track.getCapabilities();
    //
    // if ((capabilities as any).torch) {
    //   await track.applyConstraints({
    //     advanced: [{torch: true} as any],
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

    initCanvasHeight(videoSize);
  };

  const initCanvasHeight = (videoSize: InfoSize) => {
    if (!containerRef?.current) {
      return;
    }

    const height = Math.min(containerRef?.current.offsetHeight, videoSize.height);

    const width = (height * 210) / 297;

    const canvasIdealHeight = (width > containerRef?.current.scrollWidth ? (containerRef?.current.scrollWidth / 210) * 297 : height) - 64;

    setCanvasHeight(canvasIdealHeight > height ? height : canvasIdealHeight);
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

    scan();
  };

  const scan = () => {
    requestAnimationFrame(streamFeed);
  };

  const capture = async () => {
    const video: HTMLVideoElement = (videoRef.current as unknown) as HTMLVideoElement;

    if (status === 'scan') {
      await video.pause();

      setCaptureSrc(scanRef?.current?.toDataURL('image/png'));
      return;
    }

    await video.play();
    scan();

    setCaptureSrc(undefined);
  };

  useEffect(() => {
    setTimeout(() => setStatus(status === 'scan' ? 'share' : 'scan'), 150);
  }, [captureSrc]);

  const share = async () => {
    if (!captureDest) {
      return;
    }

    // const pdf: File = getPdfFile(captureDest);
    // const file = new File([captureDest], 'rebelscan.pdf', {type: 'application/pdf', lastModified: Date.now()});

    const res = await fetch(captureDest);
    const blob = await res.blob();
    const file = new File([blob], 'rebelscan.png', {type: 'image/png', lastModified: Date.now()});

    console.log(file);

    await navigator.share({
      // @ts-ignore
      files: [file],
      title: 'Pictures',
      text: 'Our Pictures.',
      url: 'https://rebelscan.com',
    });
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
      return;
    }

    setCaptureDest(($event.detail.result as HTMLCanvasElement).toDataURL('image/png'));
  };

  const canvasStyle = {'--canvas-height': `${canvasHeight}px`} as CSSProperties;

  return (
    <main className={styles.main}>
      <article ref={containerRef} className={styles.container}>
        <video className={styles.video} ref={videoRef}></video>

        <div className={styles.overlay}></div>

        {renderCanvas()}
      </article>

      {renderAction()}
    </main>
  );

  function renderCanvas() {
    if (captureSrc) {
      return (
        <WebPhotoFilter
          onFilterLoad={($event: any) => imageLoaded($event)}
          src={captureSrc}
          filter="desaturate,saturation,contrast"
          className={`${styles.scan} ${styles.filter}`}
          style={canvasStyle}
        />
      );
    }

    return <canvas ref={scanRef} className={styles.scan} style={canvasStyle}></canvas>;
  }

  function renderAction() {
    return (
      <nav className={`${styles.nav} ${status ? status : 'scan'}`}>
        <button aria-label="Scan" className={`${styles.action} scan`} onClick={capture}>
          <Image src="/icons/camera-outline.svg" alt="" aria-hidden={true} width={48} height={48} />
        </button>

        {renderShareOrDownload()}
      </nav>
    );
  }

  function renderShareOrDownload() {
    if (shareSupported) {
      return (
        <button aria-label="Share" className={`${styles.action} share`} onClick={share}>
          <Image src="/icons/share-outline.svg" alt="" aria-hidden={true} width={48} height={48} />
        </button>
      );
    }

    return (
      <button aria-label="Download" className={`${styles.action} share`} onClick={download}>
        <Image src="/icons/download-outline.svg" alt="" aria-hidden={true} width={48} height={48} />
      </button>
    );
  }
};

export default Home;
