import { describe, it, expect } from "vitest";
import { StaticDictionary } from "@/infrastructure/StaticDictionary";

const WORD_LIST = ["PIANO", "RAMER", "SALON", "TUBER", "FOLIE"];

describe("StaticDictionary — isValid", () => {
  it("Given a word present in the list, When isValid is called, Then it returns true", () => {
    const dictionary = new StaticDictionary(WORD_LIST);
    const knownWord = "PIANO";

    expect(dictionary.isValid(knownWord)).toBe(true);
  });

  it("Given a word absent from the list, When isValid is called, Then it returns false", () => {
    const dictionary = new StaticDictionary(WORD_LIST);
    const unknownWord = "XYLOF";

    expect(dictionary.isValid(unknownWord)).toBe(false);
  });

  it("Given a lowercase word present in the list, When isValid is called, Then it returns true", () => {
    const dictionary = new StaticDictionary(WORD_LIST);
    const lowercaseWord = "piano";

    expect(dictionary.isValid(lowercaseWord)).toBe(true);
  });

  it("Given a mixed-case word present in the list, When isValid is called, Then it returns true", () => {
    const dictionary = new StaticDictionary(WORD_LIST);
    const mixedCaseWord = "PiAnO";

    expect(dictionary.isValid(mixedCaseWord)).toBe(true);
  });
});

describe("StaticDictionary — pickSecret", () => {
  it("Given a dictionary, When pickSecret is called, Then it returns a word from the list", () => {
    const dictionary = new StaticDictionary(WORD_LIST);

    const secretWord = dictionary.pickSecret();

    expect(WORD_LIST).toContain(secretWord);
  });

  it("Given a dictionary, When pickSecret is called, Then it returns a 5-letter word", () => {
    const dictionary = new StaticDictionary(WORD_LIST);

    const secretWord = dictionary.pickSecret();

    expect(secretWord).toHaveLength(5);
  });

  it("Given a single-word dictionary, When pickSecret is called, Then it always returns that word", () => {
    const singleWord = ["PIANO"];
    const dictionary = new StaticDictionary(singleWord);

    const secretWord = dictionary.pickSecret();

    expect(secretWord).toBe("PIANO");
  });
});
