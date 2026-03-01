import { createMainApi } from "./mainApi";
import { createNewsApi } from "./newsApi";

export const api = {
  main: createMainApi,
  news: createNewsApi,
};