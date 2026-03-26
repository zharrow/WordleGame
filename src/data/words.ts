/**
 * Liste de mots français valides à 5 lettres (majuscules, ASCII uniquement — sans accents).
 * Le jeu utilise uniquement les 26 lettres A-Z.
 */
export const VALID_WORDS: string[] = [
  // A
  "ABIME", "ABORD", "ABRIS", "ACIER", "ADIEU", "ADORE", "AGILE",
  "AGITE", "AIGLE", "ALBUM", "ALLEE", "AMOUR", "ANCRE", "ANGLE",
  "APPEL", "ARBRE", "ARCHE", "ARENE", "ARMER", "ARRET", "ASTRE",
  "ATOUT", "AUTRE", "AVARE", "AVION",
  // B
  "BAGUE", "BALLE", "BARRE", "BAUME", "BICHE", "BILAN", "BILLE",
  "BLANC", "BOCAL", "BOIRE", "BOITE", "BOMBE", "BONDE", "BONNE",
  "BORDE", "BOTTE", "BOUGE", "BOULE", "BOURG", "BRAVE", "BRISE",
  "BRUME", "BRUIT", "BULLE",
  // C
  "CABLE", "CADRE", "CALME", "CANNE", "CARRE", "CARTE", "CAUSE",
  "CHAMP", "CHANT", "CHAOS", "CHAUD", "CHIEN", "CHOSE", "CIBLE",
  "CLORE", "CLONE", "COEUR", "CONTE", "COPIE", "CORPS", "COUPE",
  "COURT", "CRANE", "CRETE", "CRIME", "CROIX", "CRUEL", "CUIRE",
  "CYCLE",
  // D
  "DALLE", "DEBUT", "DELTA", "DENSE", "DEPOT", "DESIR", "DEUIL",
  "DIGNE", "DOIGT", "DROIT", "DUNES", "DUREE", "DUVET",
  // E
  "EBENE", "ECLAT", "ECRAN", "EFFET", "EGOUT", "EMAIL", "EMOIS",
  "ENVOL", "EPAIS", "EPINE", "EPOUX", "ETANG", "ETAPE", "ETUDE",
  "EVEIL", "EXACT", "EXCES",
  // F
  "FABLE", "FAIRE", "FALOT", "FARCE", "FAUTE", "FEMME", "FERME",
  "FICHE", "FLAIR", "FLEUR", "FLORE", "FLOTS", "FLUET", "FOLIE",
  "FORET", "FORGE", "FOSSE", "FOYER", "FRANC", "FREIN", "FUITE",
  "FUMEE",
  // G
  "GALET", "GAMIN", "GARDE", "GENRE", "GLACE", "GLOBE", "GRACE",
  "GRAIN", "GRAND", "GRAVE", "GREVE", "GUIDE",
  // H
  "HABIT", "HALTE", "HEROS", "HEURE", "HIVER", "HOMME", "HUILE",
  // I
  "IMAGE", "INDEX", "ISSUE",
  // J
  "JOUER", "JOUTE", "JURER",
  // L
  "LACER", "LAINE", "LAMPE", "LANCE", "LARGE", "LARME", "LASER",
  "LEGER", "LENTE", "LIEGE", "LIGNE", "LINGE", "LITRE", "LIVRE",
  "LONGE", "LOUER", "LUEUR", "LUTTE",
  // M
  "MAIRE", "MALLE", "MARIN", "MASSE", "MATIN", "MECHE", "MELEE",
  "METAL", "METRE", "MEUTE", "MICRO", "MINCE", "MONDE", "MONTE",
  "MORAL", "MOTIF", "MOULE", "MULET",
  // N
  "NAGER", "NAPPE", "NATTE", "NOEUD", "NOIRE", "NORME", "NOTRE",
  "NOYAU", "NUAGE", "NUIRE",
  // O
  "OBJET", "OCEAN", "OFFRE", "OLIVE", "OPALE", "ORAGE", "ORDRE",
  "ORGUE", "OVALE", "OZONE",
  // P
  "PALET", "PANSE", "PARCE", "PAROI", "PARTI", "PASSE", "PATIO",
  "PAUSE", "PEINE", "PENTE", "PERLE", "PHASE", "PIANO", "PIECE",
  "PIEGE", "PINCE", "PIXEL", "PLACE", "PLAGE", "PLIER", "PLOMB",
  "PLUME", "POEME", "POETE", "POIDS", "POINT", "POIRE", "POLAR",
  "PORTE", "POULE", "PRISE", "PROSE", "PRUNE", "PUITS", "PUREE",
  // R
  "RADIO", "RAMER", "RASER", "REBUS", "RECIT", "REGLE", "RESTE",
  "REVER", "REVUE", "ROBOT", "ROCHE", "ROMAN", "RONCE", "ROSEE",
  "ROUGE", "ROUTE", "RUBAN", "RUCHE", "RUINE",
  // S
  "SABOT", "SABLE", "SAINT", "SALIN", "SALON", "SALUT", "SANTE",
  "SAUCE", "SCOUT", "SECHE", "SELLE", "SERIE", "SIEGE", "SOBRE",
  "SOCLE", "SOEUR", "SOLDE", "SONAR", "SONDE", "SONGE", "SORTE",
  "SOUDE", "SOUPE", "SPORT", "STADE", "STORE", "STYLE", "SUCRE",
  "SUITE", "SUPER",
  // T
  "TABLE", "TACHE", "TALON", "TAPIS", "TARIF", "TARTE", "TEINT",
  "TEMPS", "TENTE", "TERME", "TEXTE", "TIGRE", "TITRE", "TOMBE",
  "TONNE", "TOTEM", "TRACE", "TRAIN", "TRAIT", "TRAME", "TRIER",
  "TROIS", "TRONE", "TROUS", "TUNER", "TYRAN",
  // U
  "UNION", "UNITE", "USINE",
  // V
  "VAGUE", "VALSE", "VEINE", "VENIR", "VENTE", "VERBE", "VERRE",
  "VERSE", "VERTU", "VESTE", "VIDEO", "VIGNE", "VILLE", "VITRE",
  "VIVRE", "VOILE", "VOLET", "VOTER",
  // X Y Z
  "XENON", "YACHT", "ZEBRE", "ZESTE",
].filter((w, i, arr) => /^[A-Z]{5}$/.test(w) && arr.indexOf(w) === i);
