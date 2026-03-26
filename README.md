# Wordle FR

Implémentation du jeu Wordle en français. Projet d'évaluation sur les tests unitaires — M1 Fullstack.

**Stack :** Next.js 16 · React 19 · TypeScript · Tailwind CSS · Shadcn UI · Vitest

## Installation

```bash
npm install
```

## Lancer les tests

```bash
# Mode watch (développement)
npm test

# Exécution unique (CI / évaluation)
npm run test:run
```

Lancer un seul fichier de test :

```bash
npx vitest run src/__tests__/domain/feedback.test.ts
```

## Lancer l'application

```bash
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Architecture

```
src/
├── domain/            # Logique métier pure — aucune dépendance framework
│   ├── types.ts       # Word, LetterFeedback, AttemptResult, GameState
│   ├── errors.ts      # InvalidWordError, InvalidLengthError, GameAlreadyOverError
│   ├── IDictionary.ts # Interface contrat du dictionnaire
│   ├── feedback.ts    # evaluateGuess() — fonction pure
│   └── game.ts        # WordleGame — reçoit IDictionary en constructeur
├── infrastructure/
│   └── StaticDictionary.ts  # Implémentation avec liste statique
├── data/
│   └── words.ts       # Liste de mots français à 5 lettres
├── hooks/
│   └── useWordle.ts   # Pont domain ↔ état React
└── components/        # GameBoard, Row, LetterTile, Keyboard
```

## Règles du jeu

- Devinez le mot secret de 5 lettres en 6 tentatives maximum.
- Feedback par lettre après chaque tentative :
  - 🟩 **CORRECT** — bonne lettre, bonne position
  - 🟨 **MISPLACED** — bonne lettre, mauvaise position
  - ⬛ **ABSENT** — lettre absente du mot secret
- **Règle lettres multiples :** si une lettre apparaît plus de fois dans la proposition que dans le secret, les occurrences surnuméraires sont marquées ABSENT.
