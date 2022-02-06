import { atom } from "recoil";

/**
 * Movie Detail of atom
 */
export const isDetail = atom({
  key: "movieDetail",
  default: false,
});

export const isTvDetail = atom({
  key: "tvDetail",
  default: false,
});

export const GlobalSearchClose = atom({
  key: "searchClose",
  default: false,
});
