"use client";

import { useState, useCallback, useRef } from "react";
import { WordleGame } from "@/domain/game";
import { StaticDictionary } from "@/infrastructure/StaticDictionary";
import type { AttemptResult, GameState, LetterFeedback } from "@/domain/types";
import {
  InvalidWordError,
  InvalidLengthError,
  GameAlreadyOverError,
} from "@/domain/errors";

export type LetterStates = Record<string, LetterFeedback>;

interface WordleHookState {
  attempts: AttemptResult[];
  gameStatus: GameState["status"];
  currentInput: string;
  letterStates: LetterStates;
  error: string | null;
  secretWord: string | null; // révélé uniquement à la fin
}

interface WordleHookActions {
  submitGuess: () => void;
  setInput: (value: string) => void;
  newGame: () => void;
}

function buildNewGame() {
  const dictionary = new StaticDictionary();
  const secret = dictionary.pickSecret();
  const game = new WordleGame(secret, dictionary);
  return { game, secret };
}

export function useWordle(): WordleHookState & WordleHookActions {
  const [{ game, secret }, setGameInstance] = useState(buildNewGame);

  const [attempts, setAttempts] = useState<AttemptResult[]>([]);
  const [gameStatus, setGameStatus] =
    useState<GameState["status"]>("IN_PROGRESS");
  const [currentInput, setCurrentInput] = useState("");
  const [letterStates, setLetterStates] = useState<LetterStates>({});
  const [error, setError] = useState<string | null>(null);
  const [secretWord, setSecretWord] = useState<string | null>(null);

  // Garde une référence stable pour éviter les captures de closure périmées
  const gameRef = useRef(game);
  gameRef.current = game;

  const submitGuess = useCallback(() => {
    setError(null);
    try {
      const result = gameRef.current.guess(currentInput);
      const newState = gameRef.current.getState();

      setAttempts([...newState.attempts]);
      setGameStatus(newState.status);
      setCurrentInput("");

      // Mettre à jour l'état des lettres (CORRECT > MISPLACED > ABSENT)
      setLetterStates((prev) => {
        const next = { ...prev };
        const priority: Record<LetterFeedback, number> = {
          CORRECT: 3,
          MISPLACED: 2,
          ABSENT: 1,
        };
        for (const { letter, feedback } of result) {
          if (!next[letter] || priority[feedback] > priority[next[letter]]) {
            next[letter] = feedback;
          }
        }
        return next;
      });

      if (newState.status !== "IN_PROGRESS") {
        setSecretWord(secret);
      }
    } catch (err) {
      if (err instanceof InvalidLengthError) {
        setError("Le mot doit faire exactement 5 lettres.");
      } else if (err instanceof InvalidWordError) {
        setError("Ce mot n'est pas dans le dictionnaire.");
      } else if (err instanceof GameAlreadyOverError) {
        setError("La partie est terminée.");
      } else {
        setError("Erreur inattendue.");
      }
    }
  }, [currentInput, secret]);

  const setInput = useCallback((value: string) => {
    setError(null);
    setCurrentInput(value.toUpperCase().slice(0, 5));
  }, []);

  const newGame = useCallback(() => {
    const next = buildNewGame();
    setGameInstance(next);
    gameRef.current = next.game;
    setAttempts([]);
    setGameStatus("IN_PROGRESS");
    setCurrentInput("");
    setLetterStates({});
    setError(null);
    setSecretWord(null);
  }, []);

  return {
    attempts,
    gameStatus,
    currentInput,
    letterStates,
    error,
    secretWord,
    submitGuess,
    setInput,
    newGame,
  };
}
