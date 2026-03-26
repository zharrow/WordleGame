import type { Word, AttemptResult, LetterFeedback } from "./types";

/**
 * Évalue une tentative par rapport au mot secret.
 *
 * Règle lettres multiples : si une lettre apparaît plus de fois dans la
 * proposition que dans le secret, les occurrences surnuméraires sont ABSENT.
 * Les CORRECT sont prioritaires sur les MISPLACED pour consommer le quota.
 */
export function evaluateGuess(guess: Word, secret: Word): AttemptResult {
  const result: AttemptResult = Array.from({ length: 5 }, (_, i) => ({
    letter: guess[i],
    feedback: "ABSENT" as LetterFeedback,
  }));

  // Compteur des lettres du secret encore "disponibles" (non consommées)
  const remainingSecret: Record<string, number> = {};
  for (const letter of secret) {
    remainingSecret[letter] = (remainingSecret[letter] ?? 0) + 1;
  }

  // Passe 1 — marquer les CORRECT et consommer leur quota
  for (let i = 0; i < 5; i++) {
    if (guess[i] === secret[i]) {
      result[i].feedback = "CORRECT";
      remainingSecret[guess[i]]--;
    }
  }

  // Passe 2 — marquer les MISPLACED avec le quota restant
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
