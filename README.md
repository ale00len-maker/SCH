# Start Crypto Hub 🚀

Dashboard crypto professionale – prezzi live, news e academy.

## Deploy su GitHub Pages

### 1. Crea il repository
```
Vai su github.com → New repository
Nome: start-crypto-hub (o quello che preferisci)
Visibilità: Public
NON inizializzare con README (lo carichiamo noi)
```

### 2. Carica i file
Carica nella root del repository:
- `index.html`
- `manifest.json`
- `sw.js`
- `.nojekyll`
- `README.md`
- cartella `icons/` con `icon-192.png` e `icon-512.png`

### 3. Abilita GitHub Pages
```
Settings → Pages → Source: Deploy from a branch
Branch: main → / (root) → Save
```

Il sito sarà online su:
`https://[tuo-username].github.io/[nome-repo]/`

> **Nota:** Per il Service Worker PWA, aggiorna il percorso in `sw.js`  
> se il sito non è nella root del dominio.

## Struttura file
```
/
├── index.html       ← app principale (self-contained)
├── manifest.json    ← configurazione PWA
├── sw.js            ← service worker (cache offline)
├── .nojekyll        ← disabilita Jekyll su GitHub Pages
├── README.md        ← questo file
└── icons/
    ├── icon-192.png
    └── icon-512.png
```
