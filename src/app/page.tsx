"use client";

import { useEffect, useCallback } from "react";
import { useWordle } from "@/hooks/useWordle";
import { GameBoard } from "@/components/GameBoard";
import { Keyboard } from "@/components/Keyboard";

export default function Home() {
  const {
    attempts,
    gameStatus,
    currentInput,
    letterStates,
    error,
    secretWord,
    submitGuess,
    setInput,
    newGame,
  } = useWordle();

  const handleKey = useCallback(
    (key: string) => setInput(currentInput + key),
    [currentInput, setInput],
  );

  const handleBackspace = useCallback(
    () => setInput(currentInput.slice(0, -1)),
    [currentInput, setInput],
  );

  // Support clavier physique
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (gameStatus !== "IN_PROGRESS") return;
      if (e.key === "Enter") submitGuess();
      else if (e.key === "Backspace") handleBackspace();
      else if (/^[a-zA-Z]$/.test(e.key)) handleKey(e.key.toUpperCase());
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [gameStatus, submitGuess, handleBackspace, handleKey]);

  return (
    <main className="flex min-h-screen flex-col items-center gap-6 bg-zinc-900 px-4 py-10 text-zinc-100">
      <header className="flex w-full max-w-sm flex-col items-center gap-1 border-b border-zinc-700 pb-4">
        <h1 className="text-3xl font-bold tracking-widest uppercase">Wordle</h1>
        <p className="text-sm text-zinc-400">Devinez le mot en 6 tentatives</p>
      </header>

      <GameBoard
        attempts={attempts}
        currentInput={currentInput}
        gameStatus={gameStatus}
      />

      {error && (
        <p className="rounded bg-red-900/50 px-4 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      {gameStatus !== "IN_PROGRESS" && (
        <div className="flex flex-col items-center gap-3 rounded-lg bg-zinc-800 px-6 py-4 text-center">
          {gameStatus === "WON" ? (
            <p className="text-lg font-semibold text-green-400">
              Bravo ! Vous avez trouvé le mot en {attempts.length} tentative
              {attempts.length > 1 ? "s" : ""}.
            </p>
          ) : (
            <p className="text-lg font-semibold text-red-400">
              Perdu ! Le mot était{" "}
              <span className="font-bold text-zinc-100">{secretWord}</span>.
            </p>
          )}
          <button
            onClick={newGame}
            className="rounded bg-zinc-700 px-4 py-2 text-sm font-medium hover:bg-zinc-600 transition-colors"
          >
            Nouvelle partie
          </button>
        </div>
      )}

      <Keyboard
        letterStates={letterStates}
        onKey={handleKey}
        onEnter={submitGuess}
        onBackspace={handleBackspace}
        disabled={gameStatus !== "IN_PROGRESS"}
      />
    </main>
  );
}
