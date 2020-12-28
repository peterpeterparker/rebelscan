import {CSSProperties, useEffect, useRef, useState} from 'react';

import styles from './Home.module.scss';

import {ScreenSize, useScreenSize} from '../../hooks/size.hook';

import {isMobile} from '@deckdeckgo/utils';

interface ExtendedMediaTrackCapabilities extends MediaTrackCapabilities {
  zoom: {min: number; max: number; step: number | string};
}

interface ExtendedMediaTrackSettings extends MediaTrackSettings {
  zoom: number;
}

const Home = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const scanRef = useRef<HTMLCanvasElement | null>(null);

  const screenSize = useScreenSize();

  const [videoSize, setVideoSize] = useState<ScreenSize | undefined>(undefined);
  const [canvasHeight, setCanvasHeight] = useState<number | undefined>(undefined);

  const [track, setTrack] = useState<MediaStreamTrack | undefined>(undefined);
  const [capabilities, setCapabilities] = useState<ExtendedMediaTrackCapabilities | undefined>(undefined);
  const [settings, setSettings] = useState<ExtendedMediaTrackSettings | undefined>(undefined);

  useEffect(() => {
    if (!scanRef?.current || !videoRef.current || !screenSize) {
      return;
    }

    init();
  }, [videoRef, scanRef, screenSize]);

  useEffect(() => {
    if (!videoSize || !canvasHeight) {
      return;
    }

    requestAnimationFrame(streamFeed);
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
        width: {ideal: 720},
        height: {ideal: 1280},
        ...(isMobile() && {facingMode: {exact: 'environment'}}),
      },
    });

    const [track] = stream.getVideoTracks();
    setTrack(track);

    if (!track) {
      return;
    }

    setCapabilities(track.getCapabilities() as ExtendedMediaTrackCapabilities);

    const settings = track.getSettings();
    setSettings(settings as ExtendedMediaTrackSettings);

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

  const initCanvasHeight = (videoSize: ScreenSize) => {
    if (!screenSize) {
      return;
    }

    const height = Math.max(screenSize.height, videoSize.height);
    const width = (height * 210) / 297;

    const canvasIdealHeight = (width > screenSize.width ? (screenSize.width / 210) * 297 : height) - 64;

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

    requestAnimationFrame(streamFeed);
  };

  const canvasStyle = {'--canvas-height': `${canvasHeight}px`} as CSSProperties;

  const zoom = ($event: any) => {
    track?.applyConstraints({advanced: [{zoom: $event.target.value} as MediaTrackConstraintSet]});
  };

  return (
    <main className={styles.main}>
      <video className={styles.video} ref={videoRef}></video>

      <div className={styles.overlay}></div>

      <canvas ref={scanRef} className={styles.scan} style={canvasStyle}></canvas>

      {renderControl()}
    </main>
  );

  function renderControl() {
    if (!settings || !capabilities) {
      return undefined;
    }

    return (
      <input
        className={styles.zoom}
        onInput={($event: any) => zoom($event)}
        type="range"
        min={capabilities.zoom?.min}
        max={capabilities.zoom?.max}
        step={capabilities.zoom?.step}
        value={settings?.zoom}
      />
    );
  }
};

export default Home;
