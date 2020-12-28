import {useEffect, useState} from 'react';

import {isIOS, debounce} from '@deckdeckgo/utils';

export interface InfoSize {
  width: number;
  height: number;
}

const screenSize = (): InfoSize => {
  if (isIOS()) {
    return {
      width: screen.width > window.innerWidth ? screen.width : window.innerWidth,
      height: screen.height > window.innerHeight ? screen.height : window.innerHeight,
    };
  } else {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  }
};

export const useScreenSize = (): InfoSize | undefined => {
  const [size, setSize] = useState<InfoSize | undefined>(undefined);

  useEffect(() => {
    const initSize = debounce(() => {
      setSize(screenSize());
    }, 250);

    window.addEventListener('resize', initSize);

    initSize();

    return () => window.removeEventListener('resize', initSize);
  }, []);

  return size;
};
