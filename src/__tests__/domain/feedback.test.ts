import { describe, it, expect } from "vitest";
import { evaluateGuess } from "@/domain/feedback";
import type { Word } from "@/domain/types";

const w = (s: string) => s as Word;

describe("evaluateGuess", () => {
  it("Given a guess identical to the secret, When evaluated, Then all letters are CORRECT", () => {
    const secretWord = w("PIANO");
    const playerGuess = w("PIANO");

    const result = evaluateGuess(playerGuess, secretWord);

    expect(result).toEqual([
      { letter: "P", feedback: "CORRECT" },
      { letter: "I", feedback: "CORRECT" },
      { letter: "A", feedback: "CORRECT" },
      { letter: "N", feedback: "CORRECT" },
      { letter: "O", feedback: "CORRECT" },
    ]);
  });

  it("Given a guess with no letters in common with the secret, When evaluated, Then all letters are ABSENT", () => {
    const secretWord = w("PIANO");
    const playerGuess = w("TUBER");

    const result = evaluateGuess(playerGuess, secretWord);

    result.forEach((r) => expect(r.feedback).toBe("ABSENT"));
  });

  it("Given a guess with correct letters at wrong positions, When evaluated, Then those letters are MISPLACED", () => {
    const secretWord = w("PIANO");
    const playerGuess = w("NOPAI");

    const result = evaluateGuess(playerGuess, secretWord);

    result.forEach((r) => expect(r.feedback).toBe("MISPLACED"));
  });

  it("Given a mixed guess, When evaluated, Then each letter gets the right feedback", () => {
    const secretWord = w("LIVRE");
    const playerGuess = w("RAMER");

    const result = evaluateGuess(playerGuess, secretWord);

    expect(result).toEqual([
      { letter: "R", feedback: "MISPLACED" },
      { letter: "A", feedback: "ABSENT" },
      { letter: "M", feedback: "ABSENT" },
      { letter: "E", feedback: "MISPLACED" },
      { letter: "R", feedback: "ABSENT" },
    ]);
  });

  it("Given a guess with a duplicated letter, When the secret has only one occurrence, Then the extra occurrence is ABSENT", () => {
    const secretWord = w("SALON");
    const playerGuess = w("LLANO");

    const result = evaluateGuess(playerGuess, secretWord);

    expect(result[0]).toEqual({ letter: "L", feedback: "MISPLACED" });
    expect(result[1]).toEqual({ letter: "L", feedback: "ABSENT" });
  });

  it("Given a guess with a duplicated letter where one is at the correct position, When evaluated, Then CORRECT is prioritised and the duplicate is ABSENT", () => {
    const secretWord = w("SALON");
    const playerGuess = w("VILLE");

    const result = evaluateGuess(playerGuess, secretWord);

    expect(result[2]).toEqual({ letter: "L", feedback: "CORRECT" });
    expect(result[3]).toEqual({ letter: "L", feedback: "ABSENT" });
  });

  it("Given a guess where a letter is at the correct position AND appears again elsewhere, When the secret has only one of that letter, Then the misplaced duplicate is ABSENT", () => {
    const secretWord = w("SALON");
    const playerGuess = w("SOLES");

    const result = evaluateGuess(playerGuess, secretWord);

    expect(result[0]).toEqual({ letter: "S", feedback: "CORRECT" });
    expect(result[4]).toEqual({ letter: "S", feedback: "ABSENT" });
  });

  it("Given any valid guess and secret, When evaluated, Then the result always has exactly 5 elements", () => {
    const result = evaluateGuess(w("PIANO"), w("SALON"));

    expect(result).toHaveLength(5);
  });

  it("Given a guess with a letter appearing 3 times and the secret has 2, When evaluated, Then exactly 2 are marked non-ABSENT and 1 is ABSENT", () => {
    const secretWord = w("BARRE");
    const playerGuess = w("RRRRA");

    const result = evaluateGuess(playerGuess, secretWord);

    const rFeedbacks = result.slice(0, 4).map((r) => r.feedback);
    const nonAbsentCount = rFeedbacks.filter((f) => f !== "ABSENT").length;
    expect(nonAbsentCount).toBe(2);
  });

  it("Given a secret with 2 identical letters and a guess with only 1, When evaluated, Then the single occurrence is not ABSENT", () => {
    const secretWord = w("BELLE");
    const playerGuess = w("BALTE");

    const result = evaluateGuess(playerGuess, secretWord);

    expect(result[2]).toEqual({ letter: "L", feedback: "CORRECT" });
  });
});
