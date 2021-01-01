export const saveFilesystem = async (content: string | BufferSource | Blob) => {
  try {
    const fileHandle: FileSystemFileHandle = await getNewFileHandle();

    await writeFile(fileHandle, content);
  } catch (err) {
    console.error(err);
  }
};

function getNewFileHandle(): Promise<FileSystemFileHandle> {
  const opts: SaveFilePickerOptions = {
    types: [
      {
        description: 'PDF',
        accept: {
          'application/pdf': ['.pdf'],
        },
      },
    ],
  };

  return showSaveFilePicker(opts);
}

async function writeFile(fileHandle: FileSystemFileHandle, content: string | BufferSource | Blob) {
  const writer = await fileHandle.createWritable();
  await writer.write(content);
  await writer.close();
}
