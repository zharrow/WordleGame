# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Wordle game — unit testing assessment. Next.js 15 + React + TypeScript + Tailwind + Shadcn UI. Testing with Vitest.

## Commands

```bash
npm install          # install dependencies
npm run dev          # start dev server
npm test             # run tests (watch mode)
npm run test:run     # run tests once (CI)
npm run build        # production build
```

Run a single test file:
```bash
npx vitest run src/__tests__/domain/feedback.test.ts
```

## Architecture

```
src/
├── domain/                    # Pure TypeScript — zero framework imports
│   ├── types.ts               # Word, LetterFeedback, AttemptResult, GameState
│   ├── errors.ts              # InvalidWordError, GameAlreadyOverError, InvalidLengthError
│   ├── IDictionary.ts         # Interface contract: isValid(), pickSecret()
│   ├── feedback.ts            # evaluateGuess(guess, secret) → AttemptResult  (pure fn)
│   └── game.ts                # WordleGame class (receives IDictionary via constructor)
├── infrastructure/
│   └── StaticDictionary.ts    # Implements IDictionary with words.ts array
├── data/
│   └── words.ts               # French 5-letter words string[]
├── hooks/
│   └── useWordle.ts           # React hook bridging domain ↔ UI state
├── components/
│   ├── GameBoard.tsx          # 6×5 grid
│   ├── Row.tsx                # One attempt row
│   ├── LetterTile.tsx         # Single tile with feedback color
│   └── Keyboard.tsx           # Visual keyboard tracking letter states
├── app/
│   ├── layout.tsx
│   └── page.tsx               # Instantiates game via DI, renders UI
└── __tests__/
    └── domain/
        ├── feedback.test.ts
        └── game.test.ts
```

## Domain Rules

- **Pure domain**: no `console.log`, `fetch`, file access, or React imports in `src/domain/`
- **Dictionary injection**: `WordleGame` receives `IDictionary` in constructor — never instantiates it internally
- **Typed errors**: `InvalidWordError`, `GameAlreadyOverError`, `InvalidLengthError` — not generic `Error`
- **Multiple letters rule**: if a letter appears more in the guess than in the secret, excess = `ABSENT`

## Test conventions

- Structure: Given / When / Then
- Variables: `secretWord`, `playerGuess` — never `a`, `b`, magic strings
- Use `FakeDictionary` stub in tests (controlled words + deterministic secret)
- No shared global state between tests
