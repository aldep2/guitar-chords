import React, { useState } from 'react'
import { getChordNotes, getOpenVoicings } from './chords'
import ChordDiagram from './ChordDiagram'

const ROOTS = ['A','A#','Bb','B','C','C#','Db','D','D#','Eb','E','F','F#','Gb','G','G#','Ab']
const TYPES = [
  {key: 'maj', label: 'maj'},
  {key: 'm', label: 'm (minor)'},
  {key: 'maj7', label: 'M7 (maj7)'},
  {key: 'm7', label: 'm7'},
  {key: '7', label: '7 (dom7)'},
  {key: '9', label: '9'},
  {key: '6', label: '6'},
  {key: 'm6', label: 'm6'},
  {key: 'maj9', label: 'maj9'},
  {key: '11', label: '11'},
  {key: '13', label: '13'},
  {key: 'm9', label: 'm9'},
  {key: 'm11', label: 'm11'},
  {key: 'm13', label: 'm13'},
  {key: 'm7b5', label: 'm7b5'},
  {key: 'dim7', label: 'dim7'},
  {key: 'aug', label: 'aug'}
]

export default function App(){
  const [root, setRoot] = useState('C')
  const [type, setType] = useState('maj7')
  const notes = getChordNotes(root, type)
  const voicings = getOpenVoicings(root, type)

  return (
    <div className="container">
      <h1>Guitar Chords Generator</h1>
      <p>Choisis la racine et le type d'accord pour voir les notes et des diagrammes (tablature simplifiée).</p>

      <div style={{display:'flex',gap:12,alignItems:'center'}}>
        <label>Racine:
          <select value={root} onChange={e=>setRoot(e.target.value)}>
            {ROOTS.map(r=> <option key={r} value={r}>{r}</option>)}
          </select>
        </label>

        <label>Type:
          <select value={type} onChange={e=>setType(e.target.value)}>
            {TYPES.map(t=> <option key={t.key} value={t.key}>{t.label}</option>)}
          </select>
        </label>
      </div>

      <section className="panel">
        <h2>Notes ({root}{type === 'maj7' ? 'maj7' : type})</h2>
        <p>{notes.join(' — ')}</p>
      </section>

      <section className="panel">
        <h2>Voicings suggérés</h2>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {voicings.map((v, i)=> (
            <div key={i} className="voicing">
              <ChordDiagram diagram={v.diagram} start={v.baseFret || v.start} />
              <div className="caption">{v.label} {v.baseFret ? `(base ${v.baseFret})` : ''} {v.playable ? '✅' : '⚠️'}</div>
              {v.fingering ? <div className="caption">Doigtés (6→1): {v.fingering.map(x=> x===null ? '-' : x).join(' ')}</div> : null}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
