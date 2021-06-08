export const shorten = (str = '', len = 12) => {
  return `${str.substr(0, len - 3)}...${str.substr(-3)}`
}

export const strToHex = function (str = '') {
  let hash = 0;
  if (str.length === 0) return hash;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 255;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
}
