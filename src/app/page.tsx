"use client";

import { useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { useWordle } from "@/hooks/useWordle";
import { useTheme } from "@/components/ThemeProvider";
import { GameBoard } from "@/components/GameBoard";
import { Keyboard } from "@/components/Keyboard";
import { Toast } from "@/components/Toast";

export default function Home() {
  const {
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
  } = useWordle();

  const { theme, toggle: toggleTheme } = useTheme();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (gameStatus !== "IN_PROGRESS") return;
      if (e.key === "Enter") submitGuess();
      else if (e.key === "Backspace") deleteLetter();
      else if (/^[a-zA-Z]$/.test(e.key)) appendLetter(e.key);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [gameStatus, submitGuess, appendLetter, deleteLetter]);

  return (
    <main className="flex min-h-screen flex-col items-center gap-6 bg-zinc-50 px-4 py-10 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100">
      {/* Toast erreur */}
      <Toast message={error} onDismiss={clearError} />

      {/* Header */}
      <header className="flex w-full max-w-lg items-center justify-between border-b border-zinc-200 pb-4 dark:border-zinc-700">
        <div className="w-8" /> {/* spacer */}
        <div className="flex flex-col items-center gap-0.5">
          <h1 className="text-3xl font-bold tracking-widest uppercase">Wordle</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Devinez le mot en 6 tentatives
          </p>
        </div>
        <button
          onClick={toggleTheme}
          aria-label="Changer le thème"
          className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-500 transition-colors hover:bg-zinc-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-100"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </header>

      {/* Zone de jeu : grille + card résultat */}
      <div className="relative">
        <GameBoard
          attempts={attempts}
          currentInput={currentInput}
          gameStatus={gameStatus}
          isShaking={isShaking}
          secretWord={secretWord}
        />

        {gameStatus !== "IN_PROGRESS" && (
          <div className="card-appear absolute top-1/2 left-[calc(100%+1.5rem)] -translate-y-1/2 flex flex-col items-center gap-3 rounded-xl bg-zinc-100 px-5 py-5 text-center shadow-md dark:bg-zinc-800 w-44">
            {gameStatus === "WON" ? (
              <p className="text-base font-semibold text-green-600 dark:text-green-400">
                Bravo ! Trouvé en{" "}
                <span className="font-bold">
                  {attempts.length} tentative{attempts.length > 1 ? "s" : ""}
                </span>
                .
              </p>
            ) : (
              <p className="text-base font-semibold text-red-600 dark:text-red-400">
                Perdu !<br />
                <span className="text-sm font-normal text-zinc-600 dark:text-zinc-300">
                  Le mot était
                </span>{" "}
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  {secretWord}
                </span>
              </p>
            )}
            <button
              onClick={newGame}
              className="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-600 dark:hover:bg-zinc-500"
            >
              Nouvelle partie
            </button>
          </div>
        )}
      </div>

      {/* Clavier */}
      <Keyboard
        letterStates={letterStates}
        onKey={appendLetter}
        onEnter={submitGuess}
        onBackspace={deleteLetter}
        disabled={gameStatus !== "IN_PROGRESS"}
      />
    </main>
  );
}
