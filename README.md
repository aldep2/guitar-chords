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

Le site sera disponible sur http://localhost:5173 par défaut.

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
# puis servir dist/ (par ex. serve ou http-server)
```

Si tu veux que la base soit `/` (site racine), supprime ou ajuste la variable `BASE_PATH` dans `.github/workflows/pages.yml`.
