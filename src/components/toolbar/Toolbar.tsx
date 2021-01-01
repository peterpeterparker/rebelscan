import {useRef} from 'react';

import Image from 'next/image';

import styles from './Toolbar.module.scss';
import {About, AboutHandles} from '../about/About';

interface ToolbarProps {
  status: 'scan' | 'share';
  capture: () => void;
  share: () => void;
  download: () => void;
}

const Toolbar = ({capture, share, download, status}: ToolbarProps) => {
  // @ts-ignore
  const shareSupported: boolean = navigator.canShare;

  const aboutRef = useRef<AboutHandles>(null);

  const openAbout = () => {
    aboutRef?.current?.display();
  };

  return (
    <>
      <nav className={`${styles.nav} ${status ? status : 'scan'}`}>
        <button aria-label="About" className={`${styles.action} about`} onClick={openAbout}>
          <Image src="/icons/information-outline.svg" alt="" aria-hidden={true} width={48} height={48} />
        </button>

        <button aria-label="Scan" className={`${styles.action} scan`} onClick={capture}>
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
        <button aria-label="Share" className={`${styles.action} share`} onClick={share} disabled={status === 'scan'}>
          <Image src="/icons/share-outline.svg" alt="" aria-hidden={true} width={48} height={48} />
        </button>
      );
    }

    return (
      <button aria-label="Download" className={`${styles.action} share`} onClick={download} disabled={status === 'scan'}>
        <Image src="/icons/download-outline.svg" alt="" aria-hidden={true} width={48} height={48} />
      </button>
    );
  }
};

export default Toolbar;
