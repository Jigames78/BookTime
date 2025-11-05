export const getCoverUrl = (title) => {
  const seed = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return `https://picsum.photos/seed/${seed}/400/600`;
};