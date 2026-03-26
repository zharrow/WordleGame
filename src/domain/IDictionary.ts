import type { Word } from "./types";

export interface IDictionary {
  isValid(word: string): boolean;
  pickSecret(): Word;
}
