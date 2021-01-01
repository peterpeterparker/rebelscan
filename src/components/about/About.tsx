import React, {forwardRef, Ref, useImperativeHandle, useState} from 'react';

import styles from './About.module.scss';

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

  return (
    <div role="button" tabIndex={0} className={`${styles.menu} ${open ? `${styles.open}` : ''}`} onClick={() => hide()} onKeyDown={() => hide()}>
      <h1>It is just little scanner app made with the web, you rebel scum!</h1>
    </div>
  );
});
