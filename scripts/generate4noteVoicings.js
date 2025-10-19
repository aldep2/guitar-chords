#!/usr/bin/env node
// Génère un fichier JSON avec voicings 4-notes pour toutes les tonalités (exemples heuristiques)
// Usage: node scripts/generate4noteVoicings.js > data/4-note-voicings.json

const roots = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];

// Représentation: array de 6 éléments pour les cordes E A D G B E (de la plus grave à la plus aiguë)
// null = muted/x, 0 = open, n = frette n

// Quelques formes à 4 notes communes (patterns relative à la case de la fondamentale)
// Les patterns sont des offsets depuis la racine (en nombre de demi-tons sur la corde correspondante)

const common4NoteShapes = [
  // triad + octave
  {label: 'root-3-5-8', frets: [0, null, 0, 0, 1, 0]},
  // small barre shape (moveable)
  {label: 'moveable-1', frets: [null, 3, 2, 0, 1, 0]},
  // 3rd inversion-ish
  {label: 'inversion-1', frets: [null, 3, 5, 5, null, null]},
];

// Mais plutôt que tenter la transposition instrumentale fragile, on va produire
// pour chaque tonique quelques formes génériques transposées (moveable shapes)

function transposeShape(shapeFrets, rootIndex, targetRootIndex, shapeRootOnStringIndex=1) {
  // On assume shapeFrets positionnés pour une racine à la corde index shapeRootOnStringIndex
  // pour simplifier on calcule un shift en demi-tons = (target - source) mod 12
  const semitoneShift = (targetRootIndex - rootIndex + 12) % 12;
  return shapeFrets.map(f => (f === null ? null : f + semitoneShift));
}

// Moveable CAGED-like shapes (expressed for C root starting positions)
const moveableCShapesForC = [
  // C major open (not all 4 notes but included for reference)
  [null, 3, 2, 0, 1, 0],
  // moveable triad (barre-ish) — root on A string
  [null, 3, 5, 5, null, null],
  // small jazz voicing moveable (root on D string)
  [null, null, 5, 4, 5, null],
];

const output = {};
for (let i=0;i<roots.length;i++){
  const root = roots[i];
  const list = [];
  moveableCShapesForC.forEach(shape=>{
    // we need to map from C to this root — assume C is at index 0
    const transposed = transposeShape(shape, 0, i);
    list.push({label: `auto-${root}`, frets: transposed});
  });
  // Add one simple closed-voicing example for each root
  list.push({label: `closed-${root}-maj7`, frets: [null, 3+i, 2+i, 0+i, 1+i, 0+i]});
  output[root] = list;
}

console.log(JSON.stringify(output, null, 2));
