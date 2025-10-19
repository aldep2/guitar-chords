import { generateVoicings, getOpenVoicings } from '../src/chords.js'

console.log('--- generateVoicings C maj7 ---')
console.log(generateVoicings('C','maj7',{maxVoicings:6}).map(v=>v.diagram))

console.log('\n--- generateVoicings C6 ---')
console.log(generateVoicings('C','6',{maxVoicings:6}).map(v=>v.diagram))

console.log('\n--- getOpenVoicings C maj7 (merged defaults) ---')
console.log(getOpenVoicings('C','maj7').map(v=>v.diagram))
