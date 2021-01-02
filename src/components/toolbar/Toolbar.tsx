import {useRef} from 'react';

import Image from 'next/image';

import styles from './Toolbar.module.scss';
import {About, AboutHandles} from '../about/About';

interface ToolbarProps {
  videoLoaded: boolean;
  status: 'scan' | 'capture' | 'share';
  capture: () => void;
  share: () => void;
  download: () => void;
}

const Toolbar = ({capture, share, download, status, videoLoaded}: ToolbarProps) => {
  // @ts-ignore
  const shareSupported: boolean = navigator.canShare;

  const aboutRef = useRef<AboutHandles>(null);

  const openAbout = () => {
    aboutRef?.current?.display();
  };

  return (
    <>
      <nav className={`${styles.nav} ${status === 'share' ? 'share' : 'scan'}`}>
        <button aria-label="About" className={`${styles.action} about`} onClick={openAbout}>
          <Image src="/icons/information-outline.svg" alt="" aria-hidden={true} width={48} height={48} />
        </button>

        <button aria-label="Scan" className={`${styles.action} scan`} onClick={capture} disabled={!videoLoaded || status === 'capture'}>
          <Image src="/icons/camera-outline.svg" alt="" aria-hidden={true} width={48} height={48} />
        </button>

        {renderShareOrDownload()}
      </nav>

      <About ref={aboutRef}></About>
    </>
  );

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
