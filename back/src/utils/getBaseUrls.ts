export const getFrontendBaseUrl = (): string => {
  if (process.env.NODE_ENV === "production") {
    return "http://localhost:3000/"; // TODO change that when in real production
  } else {
    return "http://localhost:3000/";
  }
};
