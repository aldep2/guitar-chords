# Guitar Chords Generator

Petit projet React + Vite qui génère et affiche des diagrammes d'accords de guitare.

Démarrage en local
------------------

```bash
npm install
npm run dev
```

Build de production
-------------------

Pour générer la version qui sera publiée sur GitHub Pages (site de projet), on doit construire avec la bonne base :

```bash
# construit dans dist/ avec la base /guitar-chords/
BASE_PATH=/guitar-chords/ npm run build
```

Déploiement (CI)
-----------------

Le dépôt inclut un workflow GitHub Actions (`.github/workflows/pages.yml`) qui :
- installe les dépendances,
- build le site (avec `BASE_PATH=/guitar-chords/`),
- vérifie (`sanity check`) que le build contient le bundle,
- et déploie `dist/` sur la branche `gh-pages`.

Déploiement manuel (optionnel)
------------------------------

Exemple pour pousser `dist/` sur `gh-pages` :

```bash
BASE_PATH=/guitar-chords/ npm run build
# puis copier dist/ dans la branche gh-pages (worktree)
git worktree add /tmp/gh-pages origin/gh-pages || git fetch origin gh-pages && git worktree add /tmp/gh-pages origin/gh-pages
rm -rf /tmp/gh-pages/* && cp -r dist/* /tmp/gh-pages/
cd /tmp/gh-pages
git add -A && git commit -m "chore: deploy dist (base /guitar-chords/)" || true
git push origin HEAD:gh-pages --force
```

Si tu veux que j'ajoute d'autres informations (ex. usage, captures d'écran, licence), dis‑le moi et je l'ajoute.
