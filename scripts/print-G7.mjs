import { generateVoicings, getOpenVoicings } from '../src/chords.js'

console.log('DEFAULT + merged getOpenVoicings for G7:')
console.log(getOpenVoicings('G','7').map(v=>({label:v.label, diagram:v.diagram, start:v.start})))

console.log('\nGenerated voicings for G7:')
console.log(generateVoicings('G','7',{maxVoicings:8}).map(v=>({diagram:v.diagram, baseFret:v.baseFret, playable:v.playable, score:v.score})))
