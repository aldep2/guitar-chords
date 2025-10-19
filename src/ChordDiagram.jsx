import React from 'react'
import { noteAt, formatNote, getDegreeLabel, STRING_OPEN } from './chords'

// diagram prop is a string like 'x 3 2 0 0 0' (6 values left-to-right for strings 6->1)
export default function ChordDiagram({diagram, start, orientation='vertical', root='C', size=1}){
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

  if(orientation === 'horizontal'){
    // horizontal layout: strings are horizontal lines (one per string), frets are vertical lines
    // scale dimensions by size
    const baseYStart = 30
    const baseYGap = 20
    const baseXStart = 40
    const baseXEnd = 140
    const baseFretGap = 18
    const yStart = Math.round(baseYStart * size)
    const yGap = Math.round(baseYGap * size)
    const xStart = Math.round(baseXStart * size)
    const xEnd = Math.round(baseXEnd * size)
    const fretsCount = fretsToShow
    const fretGap = Math.round(baseFretGap * size)
    // base fret number: show above the first visible fret case (centered)
    return (
      <svg width={Math.round((xEnd + 20) * size)} height={Math.round((yStart + 120) * size)} viewBox={`0 0 ${Math.round((xEnd + 20) * size)} ${Math.round((yStart + 120) * size)}`} role="img" aria-label={`Diagramme: ${diagram}`}>
        <text x={xStart + 0.5 * fretGap} y={yStart - Math.round(14 * size)} fontSize={Math.round(12 * size)} fill="#333" textAnchor="middle">{startFret > 1 ? startFret : ''}</text>
        {/* strings: horizontal lines */}
        {[0,1,2,3,4,5].map(i=> (
          <line key={i} x1={xStart} y1={yStart + i*yGap} x2={xEnd} y2={yStart + i*yGap} stroke="#444" strokeWidth={1} />
        ))}

        {/* frets: vertical lines */}
        {[0,1,2,3,4].map(i=> (
          <line key={i} x1={xStart + i*fretGap} y1={yStart - 10} x2={xStart + i*fretGap} y2={yStart + 5*yGap} stroke={(i===0 && startFret===1) ? '#222' : '#ccc'} strokeWidth={(i===0 && startFret===1) ? 5 : 2} />
        ))}

        {strings.map((s, idx)=>{
          // draw strings so that string 6 (idx 0, grave) is at the bottom like tablature
          const y = yStart + (5 - idx) * yGap
          if(s === 'x'){
            return <text key={idx} x={xStart-18} y={y+4} fontSize={12} fill="#333">x</text>
          }
          if(s === '0' && startFret===1){
            return <circle key={idx} cx={xStart-18} cy={y} r={6} fill="#fff" stroke="#222" />
          }
          const fret = parseInt(s,10)
          if(!isNaN(fret)){
            const relative = fret - startFret
            if(relative >= 0 && relative < fretsToShow){
              // place dot in the middle of the fret case (between fret lines)
              const x = xStart + (relative + 0.5) * fretGap
              const fretLabel = String(fret)
              // compute note and degree for this marker
              const fnum = parseInt(s,10)
              const n = noteAt(STRING_OPEN[idx], fnum)
              const deg = getDegreeLabel(root, n)
              // if this is the bass string, style differently
              if(idx === bassIndex){
                return (
                  <g key={idx}>
                      <circle cx={x} cy={y} r={Math.round(9 * size)} fill="#222" stroke="#f2c94c" strokeWidth={Math.max(1, Math.round(1 * size))} />
                      <text x={x} y={y + Math.round(4 * size)} fontSize={Math.round(9 * size)} fill="#fff" textAnchor="middle">{deg || ''}</text>
                  </g>
                )
              }
              return (
                <g key={idx}>
                  <circle cx={x} cy={y} r={Math.round(7 * size)} fill="#222" />
                  <text x={x} y={y + Math.round(3 * size)} fontSize={Math.round(8 * size)} fill="#fff" textAnchor="middle">{deg || ''}</text>
                </g>
              )
            } else {
              return <text key={idx} x={xStart-18} y={y+4} fontSize={10} fill="#666">{fret}</text>
            }
          }
          return null
        })}
      </svg>
    )
  }

  // default vertical layout (unchanged)
  return (
    <svg width="200" height="240" viewBox="0 0 140 160" role="img" aria-label={`Diagramme: ${diagram}`}>
      {/* show base fret number (if not nut) above the first case and centered */}
      <text x={75} y={44} fontSize={12} fill="#333" textAnchor="middle">{startFret > 1 ? startFret : ''}</text>
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
            // show fret number inside the dot for readability
            const fretLabel = String(fret)
            // highlight bass by making dot slightly larger and with a light stroke
            if(idx === bassIndex){
              return (
                <g key={idx}>
                  <circle cx={x} cy={y} r={11} fill="#222" stroke="#666" strokeWidth={1} />
                </g>
              )
            }
            return (
              <g key={idx}>
                <circle cx={x} cy={y} r={9} fill="#222" />
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
