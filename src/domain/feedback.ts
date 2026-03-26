import type { Word, AttemptResult, LetterFeedback } from "./types";

export function evaluateGuess(guess: Word, secret: Word): AttemptResult {
  const result: AttemptResult = Array.from({ length: 5 }, (_, i) => ({
    letter: guess[i],
    feedback: "ABSENT" as LetterFeedback,
  }));

  const remainingSecret: Record<string, number> = {};
  for (const letter of secret) {
    remainingSecret[letter] = (remainingSecret[letter] ?? 0) + 1;
  }

  for (let i = 0; i < 5; i++) {
    if (guess[i] === secret[i]) {
      result[i].feedback = "CORRECT";
      remainingSecret[guess[i]]--;
    }
  }

  for (let i = 0; i < 5; i++) {
    if (result[i].feedback === "CORRECT") continue;

    const letter = guess[i];
    if (remainingSecret[letter] && remainingSecret[letter] > 0) {
      result[i].feedback = "MISPLACED";
      remainingSecret[letter]--;
    }
  }

  return result;
}
