import React from 'react'
import { noteAt, formatNote } from './chords'

// diagram prop is a string like 'x 3 2 0 0 0' (6 values left-to-right for strings 6->1)
export default function ChordDiagram({diagram, start}){
  const parts = String(diagram || '').trim().split(/\s+/)
  const strings = parts.slice(0,6)
  const frettedVals = parts.map(s=> (s==='x' || s==='0') ? null : parseInt(s,10)).filter(x=>x!==null)
  const inferredStart = frettedVals.length ? Math.min(...frettedVals) : 1
  const startFret = start || (inferredStart <= 1 ? 1 : inferredStart)

  // we'll show 4 frets window starting at startFret
  const fretsToShow = 4

  // find bass: lowest-index string (leftmost) that is fretted (numeric)
  let bassIndex = -1
  for(let i=0;i<6;i++){
    const s = strings[i]
    if(s && s !== 'x' && s !== '0'){
      bassIndex = i
      break
    }
  }

  return (
    <svg width="200" height="240" viewBox="0 0 140 160" role="img" aria-label={`Diagramme: ${diagram}`}>
      {/* show base fret number (if not nut) */}
      <text x={8} y={60} fontSize={12} fill="#333">{startFret > 1 ? startFret : ''}</text>
      {/* strings */}
      {[0,1,2,3,4,5].map(i=> (
        <line key={i} x1={30 + i*18} y1={40} x2={30 + i*18} y2={140} stroke="#444" strokeWidth={1} />
      ))}
      {/* frets (4) */}
      {[0,1,2,3,4].map(i=> (
        <line key={i} x1={20} y1={50 + i*22} x2={130} y2={50 + i*22} stroke={i===0 && startFret===1 ? '#222' : '#ccc'} strokeWidth={i===0 && startFret===1 ? 5 : 2} />
      ))}

      {/* markers: render dots relative to startFret. No finger numbers, no barre drawing. */}
      {strings.map((s, idx)=>{
        const x = 30 + idx*18
        if(s === 'x'){
          return <text key={idx} x={x-6} y={34} fontSize={12} fill="#333">x</text>
        }
        if(s === '0' && startFret===1){
          return <circle key={idx} cx={x} cy={34} r={6} fill="#fff" stroke="#222" />
        }
        const fret = parseInt(s,10)
        if(!isNaN(fret)){
          const relative = fret - startFret
          if(relative >= 0 && relative < fretsToShow){
            const y = 50 + relative*22 + 11
            // compute note name for this string/fret
            const noteName = formatNote(noteAt(['E','A','D','G','B','E'][idx], fret), true)
            // highlight bass by making dot slightly larger and with a light stroke
            if(idx === bassIndex){
              return (
                <g key={idx}>
                  <circle cx={x} cy={y} r={11} fill="#222" stroke="#666" strokeWidth={1} />
                  <text x={x-10} y={y+4} fontSize={10} fill="#fff">{noteName}</text>
                </g>
              )
            }
            return (
              <g key={idx}>
                <circle cx={x} cy={y} r={9} fill="#222" />
                <text x={x-10} y={y+4} fontSize={10} fill="#fff">{noteName}</text>
              </g>
            )
          } else {
            // outside shown window: indicate number above string
            return <text key={idx} x={x-6} y={34} fontSize={10} fill="#666">{fret}</text>
          }
        }
        return null
      })}
    </svg>
  )
}
