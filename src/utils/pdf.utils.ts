import {saveFilesystem} from './file-system.utils';
import {download} from './download.utils';

import jsPDF from 'jspdf';

export const savePdf = async (src: string) => {
  const doc = new jsPDF();

  doc.addImage(src, 'image/png', 0, 0, 210, 297);

  const blob: Blob = doc.output('blob');

  if ('showSaveFilePicker' in window) {
    await saveFilesystem(blob);
    return;
  }

  download('rebelscan.pdf', blob);
};
