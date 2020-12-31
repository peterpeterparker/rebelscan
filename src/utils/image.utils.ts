export const shareImage = async (src: string) => {
  const res: Response = await fetch(src);
  const blob: Blob = await res.blob();
  const file: File = new File([blob], 'rebelscan.png', {type: 'image/png', lastModified: Date.now()});

  try {
    await navigator.share({
      // @ts-ignore
      files: [file],
      title: 'Pictures',
      text: 'Our Pictures.',
      url: 'https://rebelscan.com',
    });
  } catch (err) {
    console.error(err);
  }
};
