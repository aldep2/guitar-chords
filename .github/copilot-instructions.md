## But du fichier

Ce fichier donne des instructions concises et actionnables pour un agent IA (Copilot-like) qui doit contribuer rapidement à ce dépôt.

> Remarque : au moment de la génération, le workspace ne contenait pas de fichiers source détectables. Les sections ci‑dessous sont donc formulées comme des règles opérationnelles et des points de vérification que l'agent applique dès que les fichiers correspondants existent (ex. `package.json`, `pyproject.toml`, `src/`, `tests/`). Merci d'ajouter des exemples de fichiers si vous voulez des règles encore plus spécifiques.

## Priorités immédiates

- Rechercher ces fichiers racines et agir en conséquence : `package.json`, `pnpm-lock.yaml`, `pyproject.toml`, `requirements.txt`, `Makefile`, `Dockerfile`, `src/`, `tests/`, `.github/workflows/`.
- Si `package.json` existe : privilégier `npm ci` ou `pnpm install --frozen-lockfile` selon la présence d'un lockfile ; lancer `npm test` pour la suite de tests.
- Si `pyproject.toml` ou `requirements.txt` existe : utiliser un environnement virtuel isolé et lancer `pytest -q`.

## Architecture, patterns et where-to-look

- Chercher une topologie 'API / service / UI' : dossiers habituels `api/` ou `server/`, `frontend/` ou `web/`, `libs/` ou `packages/`.
- Rechercher services déployés via `Dockerfile` ou `k8s/` pour comprendre frontières et contrats réseau.
- Les flux de données traversent généralement `src/*` → `services/*` → `adapters/*`. Si présents, ouvrir le fichier d'entrées (ex. `src/index.js`, `main.py`) pour comprendre le point d'initialisation.

## Conventions de code et style spécifiques

- Chercher un fichier de configuration ESLint/Prettier (`.eslintrc`, `.prettierrc`) ou un fichier `pyproject.toml` avec `tool.black` pour respecter le formatage existant.
- Respecter les scripts npm définis dans `package.json` : utiliser les scripts `build`, `lint`, `test`, `start` plutôt que commandes ad‑hoc.

## Workflows CI/CD et commandes utiles

- Vérifier `.github/workflows/*` : reproduire localement les étapes critiques (linters, tests, build). Exemple : si un workflow appelle `make ci`, exécuter `make ci` localement.
- Si des actions Docker sont présentes, utiliser `docker build -f Dockerfile -t repo:local .` puis `docker run --rm repo:local` pour tests rapides.

## Tests et validation

- Prioriser l'exécution de la suite de tests existante. Chercher `tests/`, `spec/` ou `__tests__`.
- En cas de modification, exécuter :

- Node: `npm ci && npm test`
- Python: `python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt && pytest -q`

## Patterns à observer et exemples (à compléter si présents)

- API HTTP : rechercher `routes/` ou `controllers/` et exemples d'appels dans `README.md` ou `docs/`.
- Intégrations externes : clés et endpoints dans `config/` ou `env.example`. Ne jamais exfiltrer de secrets; si des variables manquantes sont nécessaires, demander au mainteneur.

## Comportement attendu de l'agent

- Ne pas modifier les scripts de build ou CI sans exécution locale et tests verts.
- Pour chaque changement : fournir une brève explication et ajouter/mettre à jour tests minimaux.
- Quand incertain, lister 2 options avec tradeoffs et demander validation humaine.

## Points manquants et questions pour le mainteneur

- Fournir les fichiers d'entrée du projet (ex. `package.json`, `pyproject.toml`, `README.md`) pour rendre ces instructions spécifiques au code.
- Indiquer la commande de build canonique si elle diffère des conventions (ex. monorepo, gestion par lerna/pnpm workspaces, Makefile custom).

## Versionning des instructions

- Mettre à jour ce fichier quand la structure du repo change. Ajouter exemples concrets (fichiers et extraits) pour rendre les recommandations non‑ambiguës.

Merci : laissez-moi savoir quelles parties sont incomplètes ou s'il y a des fichiers à analyser — je mettrai à jour ce document avec des exemples précis extraits du code.
