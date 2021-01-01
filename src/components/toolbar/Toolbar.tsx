import Image from 'next/image';

import styles from './Toolbar.module.scss';

interface ToolbarProps {
  status: 'scan' | 'share';
  capture: () => void;
  share: () => void;
  download: () => void;
}

const Toolbar = ({capture, share, download, status}: ToolbarProps) => {
  // @ts-ignore
  const shareSupported: boolean = navigator.canShare;

  return (
    <nav className={`${styles.nav} ${status ? status : 'scan'}`}>
      <button aria-label="Scan" className={`${styles.action} scan`} onClick={capture}>
        <Image src="/icons/camera-outline.svg" alt="" aria-hidden={true} width={48} height={48} />
      </button>

      {renderShareOrDownload()}
    </nav>
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
