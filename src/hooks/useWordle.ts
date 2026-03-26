"use client";

import { useState, useCallback, useRef } from "react";
import { WordleGame } from "@/domain/game";
import { StaticDictionary } from "@/infrastructure/StaticDictionary";
import type { AttemptResult, GameState, LetterFeedback, Word } from "@/domain/types";
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
  secretWord: string | null;
  isShaking: boolean;
}

interface WordleHookActions {
  submitGuess: () => void;
  appendLetter: (key: string) => void;
  deleteLetter: () => void;
  newGame: () => void;
  clearError: () => void;
}

function buildNewGame() {
  const wordSource = new StaticDictionary();
  const secret = wordSource.pickSecret();
  const permissive = { isValid: () => true, pickSecret: () => secret as Word };
  const game = new WordleGame(secret, permissive);
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
  const [isShaking, setIsShaking] = useState(false);

  const gameRef = useRef(game);
  gameRef.current = game;

  const secretRef = useRef(secret);
  secretRef.current = secret;

  const currentInputRef = useRef(currentInput);
  currentInputRef.current = currentInput;

  const triggerShake = useCallback(() => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 400);
  }, []);

  const submitGuess = useCallback(() => {
    const input = currentInputRef.current;
    setError(null);
    try {
      const result = gameRef.current.guess(input);
      const newState = gameRef.current.getState();

      setAttempts([...newState.attempts]);
      setGameStatus(newState.status);
      setCurrentInput("");

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
        setSecretWord(secretRef.current);
      }
    } catch (err) {
      if (err instanceof InvalidLengthError) {
        setError("Le mot doit faire exactement 5 lettres.");
        triggerShake();
      } else if (err instanceof InvalidWordError) {
        setError("Ce mot n'est pas dans le dictionnaire.");
        triggerShake();
      } else if (err instanceof GameAlreadyOverError) {
        setError("La partie est terminée.");
      } else {
        setError("Erreur inattendue.");
      }
    }
  }, [triggerShake]);

  const appendLetter = useCallback((key: string) => {
    setError(null);
    setCurrentInput((prev) => (prev + key.toUpperCase()).slice(0, 5));
  }, []);

  const deleteLetter = useCallback(() => {
    setCurrentInput((prev) => prev.slice(0, -1));
  }, []);

  const newGame = useCallback(() => {
    const next = buildNewGame();
    setGameInstance(next);
    gameRef.current = next.game;
    secretRef.current = next.secret;
    setAttempts([]);
    setGameStatus("IN_PROGRESS");
    setCurrentInput("");
    setLetterStates({});
    setError(null);
    setSecretWord(null);
    setIsShaking(false);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    attempts,
    gameStatus,
    currentInput,
    letterStates,
    error,
    secretWord,
    isShaking,
    submitGuess,
    appendLetter,
    deleteLetter,
    newGame,
    clearError,
  };
}
