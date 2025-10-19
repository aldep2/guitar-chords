import { getOpenVoicings } from '../src/chords.js'

const v = getOpenVoicings('C','6')
console.log('C6 voicings ->', JSON.stringify(v, null, 2))
