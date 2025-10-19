# Guitar Chords Generator (minimal)

Projet minimal React + Vite pour générer et afficher des accords de guitare jazz (voicings 4 notes : maj7, m7, 7, 9, 13, dim7).

Pour démarrer :

1. Installer les dépendances :

```bash
npm install
```

2. Lancer le serveur de développement :

```bash
npm run dev
```

Le site sera disponible sur http://localhost:5175 (Vite) pendant le développement.

Notes :

Notes : l'app est volontairement simple. Je peux ajouter plus de voicings, diagrammes graphiques, ou une API pour sauvegarder des accords.

## Déploiement sur GitHub Pages

- Un workflow GitHub Actions (`.github/workflows/pages.yml`) est inclus : il build le projet et déploie `dist/` sur GitHub Pages quand tu pousses sur la branche `main`.
- Pour une page de projet (https://<user>.github.io/<repo>/) le workflow définit `BASE_PATH` sur `/guitar-chords/` et Vite utilisera cette base lors du build.

Build local (avec base pour Pages si nécessaire) :

```bash
# pour tester localement la version qui sera publiée sous /guitar-chords/
export BASE_PATH=/guitar-chords/
npm run build
# servir le contenu de dist/ (par ex. avec 'npx serve dist' ou 'npx http-server dist')
npx serve dist
```

Remarque: `vite.config.js` utilise maintenant une base relative par défaut (`'./'`) ce qui permet au site construit de fonctionner
quand il est servi depuis une sous‑chemin (comme GitHub Pages) ou depuis le système de fichiers. Le workflow CI définit toujours `BASE_PATH`
sur `/guitar-chords/` pour générer les liens absolus si nécessaire.
