const usePreviewFile = (files) => {
  if (!files?.length) return [];
  const previewURLs = [];
  files.forEach((file) => {
    const previewImage = URL.createObjectURL(file);
    previewURLs.push(previewImage);
  });
  return previewURLs;
};
export default usePreviewFile;
