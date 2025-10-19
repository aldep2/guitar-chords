import { getOpenVoicings } from '../src/chords.js'

const roots = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B']

for(const r of roots){
  const v6 = getOpenVoicings(r,'6')
  const vm6 = getOpenVoicings(r,'m6')
  console.log(`\n== ${r}6 ==`)
  v6.forEach((v,i)=>console.log(`#${i+1}`, v.label || '', v.diagram))
  console.log(`\n== ${r}m6 ==`)
  vm6.forEach((v,i)=>console.log(`#${i+1}`, v.label || '', v.diagram))
}
