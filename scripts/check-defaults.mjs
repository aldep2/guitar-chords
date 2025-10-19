import fs from 'fs'

const roots = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']
const chords = fs.readFileSync('./src/chords.js', 'utf8')

// gather types from FORMULAS and VOICING_INTERVALS
const types = new Set()
const m1 = chords.match(/const FORMULAS = \{([\s\S]*?)\}/)
if(m1){
  for(const mm of m1[1].matchAll(/['\"](.*?)['\"]\s*:/g)) types.add(mm[1])
}
const m2 = chords.match(/const VOICING_INTERVALS = \{([\s\S]*?)\}/)
if(m2){
  for(const mm of m2[1].matchAll(/['\"](.*?)['\"]\s*:/g)) types.add(mm[1])
}

const missing = []
for(const t of Array.from(types)){
  for(const r of roots){
    const regex = new RegExp(`DEFAULT_VOICINGS\\s*\\[\\s*['\"]${t}['\"]\\s*\\]\\s*=\\s*\\{[\\s\\S]*?['\"]${r}['\"]`, 'm')
    if(!regex.test(chords)) missing.push({type:t, root:r})
  }
}

console.log('missing count:', missing.length)
if(missing.length) console.log(missing.slice(0,40))
