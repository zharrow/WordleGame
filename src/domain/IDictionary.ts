import type { Word } from "./types";

/** Contrat pour la source de mots du jeu.
 *  Le domaine ne sait pas si les mots viennent d'un fichier, d'une API ou d'une base de données. */
export interface IDictionary {
  /** Vérifie si le mot est un mot valide du dictionnaire */
  isValid(word: string): boolean;
  /** Choisit un mot secret aléatoire */
  pickSecret(): Word;
}
