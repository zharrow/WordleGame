export class InvalidWordError extends Error {
  constructor(word: string) {
    super(`"${word}" n'est pas un mot valide de 5 lettres`);
    this.name = "InvalidWordError";
  }
}

export class InvalidLengthError extends Error {
  constructor(word: string) {
    super(`"${word}" ne fait pas 5 lettres (longueur: ${word.length})`);
    this.name = "InvalidLengthError";
  }
}

export class GameAlreadyOverError extends Error {
  constructor() {
    super("La partie est déjà terminée");
    this.name = "GameAlreadyOverError";
  }
}
