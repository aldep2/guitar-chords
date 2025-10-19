But: générer un fichier JSON contenant des voicings à 4 notes pour toutes les tonalités.

Usage rapide (depuis la racine du workspace):

node scripts/generate4noteVoicings.js > data/4-note-voicings.json

Puis intégrer `data/4-note-voicings.json` dans ton projet (par ex. importer dans `src/chords.js` ou `src/data/`).

Remarques:
- Le script produit des exemples heuristiques (moveable shapes transposées). Il faut vérifier chaque voicing manuellement pour assurer musicalité.
- Si tu fournis la branche source contenant `src/`, je peux intégrer automatiquement ces voicings dans le format attendu par l'app.

Prochaine étape suggérée:
- Valider 10-20 voicings "must know" manuellement et les intégrer comme liste prioritaire.
