import {useRef} from 'react';

import Image from 'next/image';

import {isIOS} from '@deckdeckgo/utils';

import styles from './Toolbar.module.scss';

import {About, AboutHandles} from '../about/About';
import Spinner from '../spiner/Spinner';

interface ToolbarProps {
  videoLoaded: boolean;
  status: 'scan' | 'capture' | 'share';
  capture: () => void;
  share: () => void;
  download: () => void;
  init: () => void;
}

const Toolbar = ({capture, share, download, status, videoLoaded, init}: ToolbarProps) => {
  const aboutRef = useRef<AboutHandles>(null);

  const iOS: boolean = isIOS();

  // @ts-ignore
  const shareSupported: boolean = navigator.canShare && !iOS;

  const openAbout = () => {
    aboutRef?.current?.display();
  };

  return (
    <>
      <nav className={`${styles.nav} ${status === 'share' ? 'share' : 'scan'}`}>
        <button aria-label="About" className={`${styles.action} about`} onClick={openAbout}>
          <Image src="/icons/information-outline.svg" alt="" aria-hidden={true} width={48} height={48} />
        </button>

        {renderStart()}

        {renderScan()}

        {renderShareOrDownload()}
      </nav>

      <About ref={aboutRef}></About>
    </>
  );

  function renderScan() {
    if (iOS && !videoLoaded) {
      return undefined;
    }

    return (
      <button aria-label="Scan" className={`${styles.action} scan`} onClick={capture} disabled={!videoLoaded || status === 'capture'}>
        {status === 'capture' ? <Spinner></Spinner> : <Image src="/icons/camera-outline.svg" alt="" aria-hidden={true} width={48} height={48} />}
      </button>
    );
  }

  function renderStart() {
    if (!iOS || videoLoaded) {
      return undefined;
    }

    return (
      <button aria-label="Start" className={`${styles.action} scan`} onClick={init}>
        <Image src="/icons/play-outline.svg" alt="" aria-hidden={true} width={48} height={48} />
      </button>
    );
  }

  function renderShareOrDownload() {
    if (shareSupported) {
      return (
        <button aria-label="Share" className={`${styles.action} share`} onClick={share} disabled={status !== 'share' || !videoLoaded}>
          <Image src="/icons/share-outline.svg" alt="" aria-hidden={true} width={48} height={48} />
        </button>
      );
    }

    return (
      <button aria-label="Download" className={`${styles.action} share`} onClick={download} disabled={status !== 'share' || !videoLoaded}>
        <Image src="/icons/download-outline.svg" alt="" aria-hidden={true} width={48} height={48} />
      </button>
    );
  }
};

export default Toolbar;
