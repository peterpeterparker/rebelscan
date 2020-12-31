import {saveFilesystem} from './file-system.utils';
import {download} from './download.utils';

import jsPDF from 'jspdf';

export const savePdf = async (src: string) => {
  const blob: Blob = convertToPdfBlob(src);

  if ('showSaveFilePicker' in window) {
    await saveFilesystem(blob);
    return;
  }

  download('rebelscan.pdf', blob);
};

export const sharePdf = async (src: string) => {
  const blob: Blob = convertToPdfBlob(src);

  await navigator.share({
    // @ts-ignore
    files: [blob],
    title: 'Pictures',
    text: 'Our Pictures.',
  });
};

const convertToPdfBlob = (src: string): Blob => {
  const doc = new jsPDF();

  doc.addImage(src, 'image/png', 0, 0, 210, 297);

  return doc.output('blob');
};
