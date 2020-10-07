export const shorten = (str, len = 15) => {
  return `${str.substr(0, len - 3)}...${str.substr(-3)}`
}