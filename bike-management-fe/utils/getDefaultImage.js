export const getDefaultLogo = () => {
  const imageUrl = new URL("../public/image/logo.png", import.meta.url).href;
  return imageUrl;
};

export const getIndexPageCarouselImage = () => {
  const images = ["/image/homebg4.jpg", "/image/homebg2.jpg", "/image/homebg1.jpg"];
  const imageURLs = images.map((img) => new URL(img, import.meta.url).href);
  return imageURLs;
};

const getDefaultImage = () => {
  const imageUrl = new URL("../public/image/default.png", import.meta.url).href;
  return imageUrl;
};

export default getDefaultImage;
