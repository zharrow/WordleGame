import type { IDictionary } from "@/domain/IDictionary";
import type { Word } from "@/domain/types";
import { VALID_WORDS } from "@/data/words";

export class StaticDictionary implements IDictionary {
  private readonly words: Set<string>;

  constructor(words: string[] = VALID_WORDS) {
    this.words = new Set(words.map((w) => w.toUpperCase()));
  }

  isValid(word: string): boolean {
    return this.words.has(word.toUpperCase());
  }

  pickSecret(): Word {
    const index = Math.floor(Math.random() * this.words.size);
    const word = Array.from(this.words)[index];
    return word as Word;
  }
}
