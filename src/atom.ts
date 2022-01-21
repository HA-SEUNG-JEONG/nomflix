import { atom } from "recoil";

export const isDetail = atom({
  key: "movieDetail",
  default: false,
});

export const GlobalSearchClose = atom({
  key: "searchClose",
  default: false,
});
