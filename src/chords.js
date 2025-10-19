const SEMITONES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']

function normalizeRoot(note){
  if(!note) return ''
  let s = String(note).trim()
  // accept unicode flat
  s = s.replace('♭','b')
  if(s.length === 2 && (s[1] === 'b' || s[1] === 'B')){
    const base = s[0].toUpperCase()
    const flats = {A:'G#', B:'A#', C:'B', D:'C#', E:'D#', F:'E', G:'F#'}
    return flats[base] || (base)
  }
  return s.toUpperCase()
}

function indexOf(note){
  const normalized = normalizeRoot(note)
  if(!normalized) return -1
  return SEMITONES.indexOf(normalized)
}

// Normalize diagram strings to 6 tokens separated by spaces, e.g. 'x32010' or 'x 3 2 0 1 0' -> 'x 3 2 0 1 0'
function normalizeDiagram(diagram){
  if(!diagram) return 'x x x x x x'
  const s = String(diagram).trim()
  if(s.includes(' ')){
    const parts = s.split(/\s+/)
    if(parts.length === 6) return parts.join(' ')
    // try to pad or truncate
    while(parts.length < 6) parts.push('x')
    return parts.slice(0,6).join(' ')
  }
  // compact format like 'x32010' -> split into 6 chars
  const chars = s.split('')
  if(chars.length === 6) return chars.join(' ')
  // fallback: attempt to extract tokens (digits or x)
  const tokens = []
  for(let i=0;i<s.length && tokens.length<6;i++){
    const ch = s[i]
    if(ch === 'x' || ch === 'X') tokens.push('x')
    else if(/\d/.test(ch)) tokens.push(ch)
  }
  while(tokens.length < 6) tokens.push('x')
  return tokens.slice(0,6).join(' ')
}

// chord formulas in semitones from root
// Base formulas (may include more than 4 intervals)
const FORMULAS = {
  'maj7': [0,4,7,11],
  'm7': [0,3,7,10],
  '7': [0,4,7,10],
  '6': [0,4,7,9],
  'm6': [0,3,7,9],
  '9': [0,4,7,10,14],
  '13': [0,4,7,10,14,21],
  'dim7': [0,3,6,9]
}

// For jazz 4-note voicings prefer these intervals (max 4)
const VOICING_INTERVALS = {
  'maj7': [0,4,7,11],
  'm7': [0,3,7,10],
  '7': [0,4,7,10],
  // 9: 1,3,7,9 (omit 5)
  '9': [0,4,10,14],
  'maj9': [0,4,11,14],
  '11': [0,4,10,17],
  // 13: 1,3,7,13 (omit 5/9)
  '13': [0,4,10,21],
  'm9': [0,3,10,14],
  'm11': [0,3,10,17],
  'm13': [0,3,10,21],
  'm7b5': [0,3,6,10],
  'dim7': [0,3,6,9],
  '6': [0,4,7,9],
  'm6': [0,3,7,9],
  'aug': [0,4,8,11]
}

export function getChordNotes(root, type='maj7'){
  const i = indexOf(root)
  if(i===-1) return []
  const intervals = VOICING_INTERVALS[type] || FORMULAS[type] || FORMULAS['maj7']
  return intervals.slice(0,4).map(interval => SEMITONES[(i + interval)%12])
}

// Default voicings for several chord types (simple, common shapes)
const DEFAULT_VOICINGS = {
  'maj7': {
    'C': [{label:'Cmaj7 (ouvert)', diagram:'x 3 2 0 0 0'}],
    'G': [{label:'Gmaj7 (ouvert)', diagram:'3 x 0 0 0 2'}],
    'D': [{label:'Dmaj7 (ouvert)', diagram:'x x 0 2 2 2'}],
    'A': [{label:'Amaj7 (ouvert)', diagram:'x 0 2 1 2 0'}],
    'E': [{label:'Emaj7 (ouvert)', diagram:'0 2 1 1 0 0'}]
  },
  'm7': {
    'C': [{label:'Cm7 (ouvert)', diagram:'x 3 1 3 1 3'}],
    'A': [{label:'Am7 (ouvert)', diagram:'x 0 2 0 1 0'}],
    'D': [{label:'Dm7 (ouvert)', diagram:'x x 0 2 1 1'}]
  },
  '7': {
    'C': [{label:'C7 (ouvert)', diagram:'x 3 2 3 1 0'}],
    'G': [{label:'G7 (ouvert)', diagram:'3 2 0 0 0 1'}]
  },
  'add9': {
    'C': [{label:'Cadd9', diagram:'x 3 2 0 3 0'}]
  },
  '9': {
    'C': [{label:'C9', diagram:'x 3 2 3 3 3'}],
    'G': [{label:'G9', diagram:'3 x 2 3 1 1'}]
  },
  '13': {
    'C': [{label:'C13', diagram:'x 3 2 3 1 0'}]
  },
  'dim': {
    'C': [{label:'Cdim', diagram:'x 3 2 3 2 3'}]
  },
  'dim7': {
    'C': [{label:'Cdim7', diagram:'x 3 1 3 1 3'}]
  },
  'maj': {
    'C': [{label:'C (open)', diagram:'x 3 2 0 1 0'}]
  },
  'm': {
    'C': [{label:'Cm (open)', diagram:'x 3 5 5 4 3'}]
  }
}

// Add common 6th voicings (examples)
DEFAULT_VOICINGS['6'] = {
  'C': [{ label: 'C6 (open)', diagram: 'x 3 2 2 1 0' }]
}

// Common triads (major) for all 12 roots
const COMMON_TRIADS_MAJOR = {
  'C':  {label: 'C (open)', diagram: 'x32010'},
  'C#': {label: 'C# (barre)', diagram: 'x46664'},
  'D':  {label: 'D (open)', diagram: 'xx0232'},
  'D#': {label: 'D# (barre)', diagram: 'xx1343'},
  'E':  {label: 'E (open)', diagram: '022100'},
  'F':  {label: 'F (barre)', diagram: '133211'},
  'F#': {label: 'F# (barre)', diagram: '244322'},
  'G':  {label: 'G (open)', diagram: '320003'},
  'G#': {label: 'G# (barre)', diagram: '466544'},
  'A':  {label: 'A (open)', diagram: 'x02220'},
  'A#': {label: 'A# (barre)', diagram: 'x13331'},
  'B':  {label: 'B (barre)', diagram: 'x24442'}
}

// Common triads (minor) for all 12 roots (mapped by root name)
const COMMON_TRIADS_MINOR = {
  'C':  {label: 'Cm (barre)', diagram: 'x35543'},
  'C#': {label: 'C#m (barre)', diagram: 'x46654'},
  'D':  {label: 'Dm (open)', diagram: 'xx0231'},
  'D#': {label: 'D#m (barre)', diagram: 'xx1342'},
  'E':  {label: 'Em (open)', diagram: '022000'},
  'F':  {label: 'Fm (barre)', diagram: '133111'},
  'F#': {label: 'F#m (barre)', diagram: '244222'},
  'G':  {label: 'Gm (barre)', diagram: '355333'},
  'G#': {label: 'G#m (barre)', diagram: '466444'},
  'A':  {label: 'Am (open)', diagram: 'x02210'},
  'A#': {label: 'A#m (barre)', diagram: 'x13321'},
  'B':  {label: 'Bm (barre)', diagram: 'x24432'}
}

export function getOpenVoicings(root, type='maj7'){
  const t = DEFAULT_VOICINGS[type] || {}
  const defaults = t[root] || []
  const rootUpper = String(root).toUpperCase()
  // prepend common triads only when user asked for basic triads (maj or m)
  const triadList = []
  if(type === 'maj'){
    if(COMMON_TRIADS_MAJOR[rootUpper]) triadList.push(COMMON_TRIADS_MAJOR[rootUpper])
  }
  if(type === 'm'){
    if(COMMON_TRIADS_MINOR[rootUpper]) triadList.push(COMMON_TRIADS_MINOR[rootUpper])
  }
  // always generate algorithmic voicings and merge with defaults
  // enforce maxSpan = 3 (4 frets window)
  const generated = generateVoicings(root, type, {maxFret:12, maxSpan:3, maxVoicings:12})
  // merge defaults first, then generated (avoid duplicates)
  const seen = new Set()
  const merged = []
  // we want to keep triads even if they contain open strings; generated voicings should avoid open strings
  const allCandidates = [...triadList, ...defaults, ...generated]
  for(const v of allCandidates){
    const rawDiagram = v && v.diagram ? v.diagram : String(v)
    const diagram = normalizeDiagram(rawDiagram)
    // Skip generated voicings that contain open strings (keep jazz preference), but allow triads/defaults
    const isGenerated = generated.includes(v)
    if(isGenerated && diagram.split(/\s+/).includes('0')) continue
    if(!seen.has(diagram)){
      seen.add(diagram)
      merged.push(Object.assign({}, v, {diagram}))
    }
  }
  // From merged, choose up to 3 voicings representing 3 different neck areas:
  // - nut area (start fret 1)
  // - middle (start 2-5)
  // - upper (start >=6)
  const buckets = {nut: [], mid: [], high: []}
  for(const v of merged){
    // compute start fret
    const frets = v.diagram.split(/\s+/).map(s => (s==='x' || s==='0') ? null : parseInt(s,10)).filter(x=>x!==null)
    const minF = frets.length ? Math.min(...frets) : 0
    const start = (minF <= 1) ? 1 : minF
    if(start <= 1) buckets.nut.push({...v, start})
    else if(start <=5) buckets.mid.push({...v, start})
    else buckets.high.push({...v, start})
  }

  // choose up to 4 voicings: prefer nut, mid, high, then next best available
  const selection = []
  if(buckets.nut.length) selection.push(buckets.nut[0])
  if(buckets.mid.length) selection.push(buckets.mid[0])
  if(buckets.high.length) selection.push(buckets.high[0])
  // fill remaining slots with next best from sorted merged list
  for(const v of merged){
    if(selection.length >= 4) break
    if(!selection.find(s=>s.diagram === v.diagram)) selection.push(v)
  }
  return selection.length ? selection.slice(0,4) : [{label:'Voicing non listé', diagram:'x x x x x x', start:1}]
}

// ---------------------- voicing generator ----------------------
const STRING_OPEN = ['E','A','D','G','B','E']

function noteIndex(note){
  return SEMITONES.indexOf(note)
}

export function noteAt(stringOpen, fret){
  const idx = noteIndex(stringOpen)
  if(idx === -1) return null
  return SEMITONES[(idx + fret) % 12]
}

// format note for display: optionally convert sharps to flats for readability
export function formatNote(note, preferFlats = true){
  if(!note) return ''
  if(!preferFlats) return note
  const map = { 'C#':'Db', 'D#':'Eb', 'F#':'Gb', 'G#':'Ab', 'A#':'Bb' }
  return map[note] || note
}

function buildOptionsPerString(chordNotes){
  // For each string, list candidate frets (including 0) within first 7 frets where the note belongs to chordNotes
  const options = []
  for(const open of STRING_OPEN){
    // no open strings: start with muted option only
    const opts = ['x']
    // consider frets 1..12 only to avoid open chords
    for(let f=1; f<=12; f++){
      const n = noteAt(open, f)
      if(chordNotes.includes(n)){
        opts.push(String(f))
      }
      // limit options per string to keep search small
      if(opts.length >= 6) break
    }
    options.push(opts)
  }
  return options
}

function scoreVoicing(v, chordNotes, root, type){
  // v is array [s6..s1] of 'x' or '0' or '3'
  const fretted = v.filter(x => x !== 'x' && x !== '0').map(x => parseInt(x,10))
  const fingers = fretted.length
  const avgFret = fretted.length ? fretted.reduce((a,b)=>a+b,0)/fretted.length : 0
  const span = fretted.length ? Math.max(...fretted) - Math.min(...fretted) : 0

  // determine preferred third: if type indicates minor (m, m7) prefer minor third
  const rootIdx = noteIndex(root)
  const major3 = SEMITONES[(rootIdx + 4) % 12]
  const minor3 = SEMITONES[(rootIdx + 3) % 12]
  const prefersMinor = (type === 'm' || type.startsWith('m') && !type.startsWith('maj'))

  // check if third present
  let hasThird = false
  for(let i=0;i<6;i++){
    const s = v[i]
    if(s !== 'x'){
      const f = parseInt(s,10)
      const n = noteAt(STRING_OPEN[i], f)
      if(n === major3 || n === minor3) hasThird = true
    }
  }

  // contiguousness: prefer voicings where fretted notes are close together
  let contiguousScore = 0
  if(fretted.length <= 1) contiguousScore = 1
  else contiguousScore = 1 / (1 + span)

  // base score: lower is better
  let score = fingers * 5 + avgFret * 2 + span * 2 - contiguousScore * 5
  // penalize missing third strongly for most chords (except dim where third is ambiguous)
  if(!hasThird && !type.startsWith('dim')) score += 50
  return score
}

export function generateVoicings(root, type='maj7', opts={maxFret:12, maxSpan:4, maxVoicings:8}){
  const chordNotes = getChordNotes(root, type)
  if(!chordNotes.length) return []
  const perString = buildOptionsPerString(chordNotes)
  const resultsShell = [] // voicings matching bass + contiguous 3-string shell
  const resultsOther = [] // fallback voicings

  function backtrack(idx, acc){
    if(resultsShell.length + resultsOther.length >= opts.maxVoicings*5) return // safety cap
    if(idx === 6){
      // validate: must include all chord notes at least once
      const present = new Set()
      for(const s of acc){
        if(s !== 'x'){
          const n = noteAt(STRING_OPEN[accIndexMap(acc, s)], parseInt(s,10))
          // but we don't have mapping here; instead compute per string by reconstructing later
        }
      }
      // easier: recompute notes from acc
      const notesPresent = new Set()
      for(let i=0;i<6;i++){
        const s = acc[i]
        if(s !== 'x'){
          const f = parseInt(s,10)
          notesPresent.add(noteAt(STRING_OPEN[i], f))
        }
      }
      const allPresent = chordNotes.every(n => notesPresent.has(n))
      if(!allPresent) return

      // compute span
      const fretted = acc.filter(x=> x !== 'x' && x !== '0').map(x=>parseInt(x,10))
      const minF = fretted.length ? Math.min(...fretted) : 0
      const maxF = fretted.length ? Math.max(...fretted) : 0
      // ensure span fits within maxSpan (e.g. 3 means 4 frets)
      if(fretted.length && (maxF - minF) > opts.maxSpan) return

      const diagram = acc.join(' ')
      const baseFret = fretted.length ? minF : 0
      const sc = scoreVoicing(acc, chordNotes, root, type)

      // Check for playable pattern: one bass on a lower string and three adjacent fretted strings above
      const frettedIdx = []
      for(let i=0;i<6;i++){
        const v = acc[i]
        if(v !== 'x') frettedIdx.push(i)
      }

      // enforce 4 fretted notes (4-note voicing)
      if(frettedIdx.length === 4){
        // find a contiguous block of 3 fretted strings where a bass exists below the block
        let hasPlayableShell = false
        let shellStart = -1
        let bassIdx = -1
        for(let i=0;i<=3;i++){
          if(frettedIdx.includes(i) && frettedIdx.includes(i+1) && frettedIdx.includes(i+2)){
            const bassBelow = frettedIdx.find(j => j < i)
            if(bassBelow !== undefined){
              hasPlayableShell = true
              shellStart = i
              bassIdx = bassBelow
              break
            }
          }
        }

        const vo = {diagram, score: sc, baseFret, playable: !!hasPlayableShell}
        if(hasPlayableShell){
          resultsShell.push(vo)
        } else {
          // keep as fallback, but only if there is no barre (we prefer no barrés)
          resultsOther.push(vo)
        }
      } else {
        // not exactly 4 fretted notes — ignore for primary list
        resultsOther.push({diagram, score: sc, baseFret, playable:false})
      }
      return
    }

    for(const choice of perString[idx]){
      // quick prune: don't allow extremely high frets
      if(choice !== 'x' && parseInt(choice,10) > opts.maxFret) continue
      acc.push(choice)
      // prune early by checking current span
      const fretted = acc.filter(x=> x !== 'x' && x !== '0').map(x=>parseInt(x,10))
      if(fretted.length){
        const minF = Math.min(...fretted)
        const maxF = Math.max(...fretted)
        if((maxF - minF) > opts.maxSpan){
          acc.pop();
          continue
        }
      }
      backtrack(idx+1, acc)
      acc.pop()
      if(resultsShell.length + resultsOther.length >= opts.maxVoicings*5) break
    }
  }

  backtrack(0, [])

  // prefer shell results (bass + 3 adjacent strings). If none found, fall back to other results.
  const candidateList = (resultsShell.length ? resultsShell : resultsOther)

  // dedupe and sort by score
  const uniq = new Map()
  for(const r of candidateList){
    if(!uniq.has(r.diagram) || uniq.get(r.diagram).score > r.score){
      uniq.set(r.diagram, r)
    }
  }
  const sorted = Array.from(uniq.values()).sort((a,b)=>a.score - b.score)

  // Bucket by position and pick up to one from each: nut (<=1), mid (2-5), high (6+)
  const buckets = {nut: [], mid: [], high: []}
  for(const s of sorted){
    const frets = s.diagram.split(/\s+/).map(x=> (x==='x' || x==='0')? null : parseInt(x,10)).filter(x=>x!==null)
    const minF = frets.length ? Math.min(...frets) : 0
    if(minF <= 1) buckets.nut.push(s)
    else if(minF <=5) buckets.mid.push(s)
    else buckets.high.push(s)
  }

  const pickTop = (arr) => arr.length ? [arr[0]] : []
  const picked = [...pickTop(buckets.nut), ...pickTop(buckets.mid), ...pickTop(buckets.high)].filter(Boolean)
  const final = picked.length ? picked : sorted.slice(0, Math.min(opts.maxVoicings, 3))
  return final.map(s=>({label: `${root}${type} (gen)`, diagram: s.diagram, baseFret: s.baseFret, playable: s.playable}))
}

function accIndexMap(acc, val){
  return acc.indexOf(val)
}

// Ensure DEFAULT_VOICINGS contains entries for 6 and m6 for all roots.
// If a manual default exists (e.g. C6 already present), we keep it. Otherwise
// generate a few candidate voicings via generateVoicings and use them as defaults.
;(function ensureSixthVoicings(){
  try{
    const types = ['6','m6']
    for(const t of types){
      DEFAULT_VOICINGS[t] = DEFAULT_VOICINGS[t] || {}
      for(const root of SEMITONES){
        if(!DEFAULT_VOICINGS[t][root]){
          const gens = generateVoicings(root, t, {maxVoicings:3, maxSpan:4})
          // store up to 3 generated voicings as defaults
          DEFAULT_VOICINGS[t][root] = gens.slice(0,3).map(g => ({ label: g.label, diagram: g.diagram }))
        }
      }
    }
  }catch(e){
    // if generation fails during import for any reason, fail silently to avoid breaking app
    console.warn('Could not auto-populate 6/m6 defaults:', e && e.message)
  }
})()

// Populate DEFAULT_VOICINGS for any chord types that don't have manual defaults.
;(function ensureAllVoicings(){
  try{
    // collect types from formulas and voicing intervals
    const types = new Set([...Object.keys(FORMULAS), ...Object.keys(VOICING_INTERVALS)])
    for(const t of types){
      DEFAULT_VOICINGS[t] = DEFAULT_VOICINGS[t] || {}
      for(const root of SEMITONES){
        if(!DEFAULT_VOICINGS[t][root]){
          const gens = generateVoicings(root, t, {maxVoicings:3, maxSpan:4})
          if(gens && gens.length){
            DEFAULT_VOICINGS[t][root] = gens.slice(0,3).map(g => ({ label: g.label, diagram: g.diagram }))
          }
        }
      }
    }
  }catch(e){
    console.warn('Could not auto-populate defaults for all voicings:', e && e.message)
  }
})()
