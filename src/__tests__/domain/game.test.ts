import { describe, it, expect, beforeEach } from "vitest";
import { WordleGame } from "@/domain/game";
import { InvalidWordError, InvalidLengthError, GameAlreadyOverError } from "@/domain/errors";
import type { IDictionary } from "@/domain/IDictionary";
import type { Word } from "@/domain/types";

// ── Test double : FakeDictionary ──────────────────────────────────────────────

function makeFakeDictionary(validWords: string[], secret: string): IDictionary {
  return {
    isValid: (word: string) => validWords.includes(word.toUpperCase()),
    pickSecret: () => secret.toUpperCase() as Word,
  };
}

// ── Setup partagé ─────────────────────────────────────────────────────────────

const SECRET_WORD = "PIANO";
const VALID_WORDS = ["PIANO", "RAMER", "SALON", "TUBER", "ONAIP", "BILLE", "FOLIE"];

let dictionary: IDictionary;
let game: WordleGame;

beforeEach(() => {
  dictionary = makeFakeDictionary(VALID_WORDS, SECRET_WORD);
  game = new WordleGame(SECRET_WORD as Word, dictionary);
});

// ── Cas nominaux ──────────────────────────────────────────────────────────────

describe("WordleGame — cas nominaux", () => {
  it("Given a new game, When the player guesses the secret word, Then the game status becomes WON", () => {
    const playerGuess = "PIANO";

    game.guess(playerGuess);

    expect(game.getState().status).toBe("WON");
  });

  it("Given a new game, When the player submits a valid guess, Then the attempt is recorded in the state", () => {
    const playerGuess = "RAMER";

    game.guess(playerGuess);

    expect(game.getState().attempts).toHaveLength(1);
  });

  it("Given a new game, When the player submits a valid guess, Then the result contains one feedback per letter", () => {
    const playerGuess = "RAMER";

    const result = game.guess(playerGuess);

    expect(result).toHaveLength(5);
    result.forEach((r) => {
      expect(["CORRECT", "MISPLACED", "ABSENT"]).toContain(r.feedback);
    });
  });

  it("Given a game with 6 failed attempts, When evaluated, Then the game status becomes LOST", () => {
    const wrongGuess = "RAMER";

    for (let i = 0; i < 6; i++) {
      game.guess(wrongGuess);
    }

    expect(game.getState().status).toBe("LOST");
  });

  it("Given a game won on the 3rd attempt, When checking state, Then attempts count is 3 and status is WON", () => {
    game.guess("RAMER");
    game.guess("SALON");
    game.guess("PIANO");

    const state = game.getState();

    expect(state.attempts).toHaveLength(3);
    expect(state.status).toBe("WON");
  });

  it("Given 5 wrong guesses then the correct word, When evaluated, Then status is WON not LOST", () => {
    const wrongGuess = "RAMER";

    for (let i = 0; i < 5; i++) {
      game.guess(wrongGuess);
    }
    game.guess("PIANO");

    expect(game.getState().status).toBe("WON");
  });

  it("Given a guess, When state is read, Then attempts[0] contains 5 letter-feedback pairs", () => {
    game.guess("RAMER");

    const { attempts } = game.getState();

    expect(attempts[0]).toHaveLength(5);
    expect(attempts[0][0]).toMatchObject({ letter: "R", feedback: expect.any(String) });
  });

  it("Given a new game, When the state is read, Then status is IN_PROGRESS and attempts is empty", () => {
    const state = game.getState();

    expect(state.status).toBe("IN_PROGRESS");
    expect(state.attempts).toHaveLength(0);
    expect(state.maxAttempts).toBe(6);
  });
});

// ── Cas d'erreur ──────────────────────────────────────────────────────────────

describe("WordleGame — erreurs métier", () => {
  it("Given an in-progress game, When the player guesses a word not in the dictionary, Then an InvalidWordError is thrown", () => {
    const unknownWord = "XYLOF";

    expect(() => game.guess(unknownWord)).toThrow(InvalidWordError);
  });

  it("Given an in-progress game, When the player submits a word shorter than 5 letters, Then an InvalidLengthError is thrown", () => {
    const shortWord = "ALLO";

    expect(() => game.guess(shortWord)).toThrow(InvalidLengthError);
  });

  it("Given an in-progress game, When the player submits a word longer than 5 letters, Then an InvalidLengthError is thrown", () => {
    const longWord = "CLAVIER";

    expect(() => game.guess(longWord)).toThrow(InvalidLengthError);
  });

  it("Given a game that is WON, When the player tries to guess again, Then a GameAlreadyOverError is thrown", () => {
    game.guess("PIANO");

    expect(() => game.guess("RAMER")).toThrow(GameAlreadyOverError);
  });

  it("Given a game that is LOST, When the player tries to guess again, Then a GameAlreadyOverError is thrown", () => {
    for (let i = 0; i < 6; i++) {
      game.guess("RAMER");
    }

    expect(() => game.guess("PIANO")).toThrow(GameAlreadyOverError);
  });

  it("Given a WON game, When an invalid-length word is submitted, Then GameAlreadyOverError takes priority over InvalidLengthError", () => {
    game.guess("PIANO");

    expect(() => game.guess("AB")).toThrow(GameAlreadyOverError);
  });
});

// ── Normalisation ─────────────────────────────────────────────────────────────

describe("WordleGame — normalisation de la saisie", () => {
  it("Given a lowercase guess, When submitted, Then it is accepted as if uppercase", () => {
    const playerGuess = "piano";

    game.guess(playerGuess);

    expect(game.getState().status).toBe("WON");
  });

  it("Given a mixed-case guess, When submitted, Then it is accepted as if uppercase", () => {
    const playerGuess = "PiAnO";

    game.guess(playerGuess);

    expect(game.getState().status).toBe("WON");
  });
});

// ── Isolation : le jeu ne dépend que du contrat IDictionary ──────────────────

describe("WordleGame — isolation", () => {
  it("Given a dictionary stub that rejects all words, When any guess is submitted, Then InvalidWordError is thrown", () => {
    const emptyDictionary: IDictionary = {
      isValid: () => false,
      pickSecret: () => "PIANO" as Word,
    };
    const isolatedGame = new WordleGame("PIANO" as Word, emptyDictionary);

    expect(() => isolatedGame.guess("PIANO")).toThrow(InvalidWordError);
  });

  it("Given a state snapshot, When the caller mutates attempts, Then the game state is unaffected", () => {
    game.guess("RAMER");

    const state = game.getState();
    state.attempts.pop();

    expect(game.getState().attempts).toHaveLength(1);
  });

  it("Given a dictionary stub that accepts all words, When any 5-letter guess is submitted, Then no dictionary error is thrown", () => {
    const permissiveDictionary: IDictionary = {
      isValid: () => true,
      pickSecret: () => "PIANO" as Word,
    };
    const isolatedGame = new WordleGame("PIANO" as Word, permissiveDictionary);

    expect(() => isolatedGame.guess("ZZZZZ")).not.toThrow();
  });
});
