import { describe, it, expect } from "vitest";
import { evaluateGuess } from "@/domain/feedback";
import type { Word } from "@/domain/types";

const w = (s: string) => s as Word;

describe("evaluateGuess", () => {
  // ── Happy paths ──────────────────────────────────────────────────

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
    // NOPAI est une anagramme de PIANO où aucune lettre n'est à sa position d'origine
    const secretWord = w("PIANO");
    const playerGuess = w("NOPAI");

    const result = evaluateGuess(playerGuess, secretWord);

    result.forEach((r) => expect(r.feedback).toBe("MISPLACED"));
  });

  it("Given a mixed guess, When evaluated, Then each letter gets the right feedback", () => {
    // Secret: LIVRE — example from the instructions
    // Guess:  RAMER
    // R(1)=MISPLACED, A(2)=ABSENT, M(3)=ABSENT, E(4)=MISPLACED, R(5)=ABSENT
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

  // ── Règle des lettres multiples ───────────────────────────────────

  it("Given a guess with a duplicated letter, When the secret has only one occurrence, Then the extra occurrence is ABSENT", () => {
    // Secret: BALLE — 2×L
    // Guess:  LLAMA — 2×L mais seuls 2 L dans secret aussi → les deux sont CORRECT/MISPLACED
    // Secret: SALON — 1×L
    // Guess:  LLANO — 2×L : premier L MISPLACED, second L ABSENT
    const secretWord = w("SALON");
    const playerGuess = w("LLANO");

    const result = evaluateGuess(playerGuess, secretWord);

    // L(0) → MISPLACED (L est dans SALON, mauvaise position)
    // L(1) → ABSENT (quota L épuisé)
    // A(2) → CORRECT
    // N(3) → MISPLACED
    // O(4) → MISPLACED
    expect(result[0]).toEqual({ letter: "L", feedback: "MISPLACED" });
    expect(result[1]).toEqual({ letter: "L", feedback: "ABSENT" });
  });

  it("Given a guess with a duplicated letter where one is at the correct position, When evaluated, Then CORRECT is prioritised and the duplicate is ABSENT", () => {
    // Secret: SALON (1×L en position 2)
    // Guess:  VILLE — L en pos 2 (CORRECT) et L en pos 3 (extra)
    // L(2) est CORRECT → consomme le seul L disponible
    // L(3) n'a plus de quota → ABSENT
    const secretWord = w("SALON");
    const playerGuess = w("VILLE");

    const result = evaluateGuess(playerGuess, secretWord);

    expect(result[2]).toEqual({ letter: "L", feedback: "CORRECT" });
    expect(result[3]).toEqual({ letter: "L", feedback: "ABSENT" });
  });

  it("Given a guess where a letter is at the correct position AND appears again elsewhere, When the secret has only one of that letter, Then the misplaced duplicate is ABSENT", () => {
    // Secret: SALON (1×S), Guess: BISES — S en pos 2 et pos 4
    // Normalisé: secret=SALON, guess=SOLES
    // S(0)=CORRECT, O(1)=MISPLACED, L(2)=MISPLACED, E(3)=ABSENT, S(4)=ABSENT
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
    // Secret: ABACA (3×A), Guess: AAABC
    // A(0)=CORRECT, A(1)=CORRECT, A(2)=CORRECT (3 A dans secret)
    // mais ici secret=ARBRE (1×R), guess=RRRRE
    // Secret: BARRE (2×R), Guess: RRRRA
    // R(0)=MISPLACED, R(1)=CORRECT, R(2)=ABSENT (quota 2 épuisé), R(3)=ABSENT, A=ABSENT
    const secretWord = w("BARRE");
    const playerGuess = w("RRRRA");

    const result = evaluateGuess(playerGuess, secretWord);

    const rFeedbacks = result.slice(0, 4).map((r) => r.feedback);
    const nonAbsentCount = rFeedbacks.filter((f) => f !== "ABSENT").length;
    expect(nonAbsentCount).toBe(2); // exactement 2 R marqués (comme dans le secret)
  });

  it("Given a secret with 2 identical letters and a guess with only 1, When evaluated, Then the single occurrence is not ABSENT", () => {
    // BELLE a 2×L, BALTE a 1×L en position 2 (CORRECT car pos 2 dans BELLE = L)
    const secretWord = w("BELLE");
    const playerGuess = w("BALTE");

    const result = evaluateGuess(playerGuess, secretWord);

    expect(result[2]).toEqual({ letter: "L", feedback: "CORRECT" });
  });
});
