export function getYoutubeVideoIdFromUrl(url: string) {
  const regExp = /(?:youtube\.com\/.*v=|youtu\.be\/)([^&]+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}
