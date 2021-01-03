import React, {forwardRef, Ref, useImperativeHandle, useState} from 'react';

import styles from './About.module.scss';
import Image from 'next/image';

export interface AboutHandles {
  display(): void;
}

export const About = forwardRef<AboutHandles>((props, ref) => {
  useImperativeHandle(ref, () => ({display}));

  const [open, setOpen] = useState(false);

  const hide = () => {
    setOpen(false);
  };

  const display = () => {
    setOpen(true);
  };

  const share = async ($event: React.MouseEvent<HTMLElement>) => {
    $event.stopPropagation();

    try {
      await navigator.share({
        title: 'Rebel Scan',
        text: 'A little scanner app made with the web, you rebel scum!',
        url: 'https://rebelscan.com',
      });
    } catch (err) {
      console.error('Error while trying to share Rebel Scan', err);
    }
  };

  return (
    <div role="button" tabIndex={0} className={`${styles.menu} ${open ? `${styles.open}` : ''}`} onClick={() => hide()} onKeyDown={() => hide()}>
      <button aria-label="Close" className={styles.close}>
        <Image src="/icons/close-outline.svg" alt="" aria-hidden={true} width={48} height={48} />
      </button>

      <h1 className={styles.title}>Rebel Scan</h1>

      <h2 className={styles.subtitle}>A little scanner app made with the web, you rebel scum!</h2>

      <div className={styles.social}>
        <a
          onClick={($event) => $event.stopPropagation()}
          href="https://twitter.com/intent/tweet?url=https%3A%2F%2Frebelscan.com&text=A%20little%20scanner%20app%20made%20by%20%40daviddalbusco%20with%20the%20web%2C%20you%20rebel%20scum!"
          rel="noopener norefferer"
          aria-label="Twitter">
          <img loading="lazy" src="/icons/logo-twitter.svg" aria-hidden="true" alt="" style={{width: '4rem', padding: '0.45rem'}} />
        </a>

        <a onClick={($event) => $event.stopPropagation()} href="https://github.com/peterpeterparker/rebelscan" rel="noopener noreferrer" aria-label="GitHub">
          <img loading="lazy" src="/icons/logo-github.svg" aria-hidden="true" alt="" style={{width: '4rem', padding: '0.45rem'}} />
        </a>

        <button onClick={share} aria-label="Share Rebel Scan">
          <img loading="lazy" src="/icons/share-outline.svg" aria-hidden="true" alt="" style={{width: '4rem', padding: '0.45rem'}} />
        </button>
      </div>

      <h2 className={styles.made}>
        Developed by{' '}
        <a onClick={($event) => $event.stopPropagation()} href="https://daviddalbusco.com" rel="noopener noreferrer" aria-label="David Dal Busco">
          David Dal Busco
        </a>
      </h2>
    </div>
  );
});
