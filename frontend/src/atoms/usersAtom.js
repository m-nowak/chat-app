import { atom } from "recoil";

const usersAtom = atom({
  key: "usersAtom",
  default: [],
});

export default usersAtom;
