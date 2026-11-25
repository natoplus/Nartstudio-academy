import { useEffect, useState } from 'react'

type Scene = { title: string; purpose: string }
type Plan = { title: string; promise: string; ending: string; scenes: Scene[] }
const initialPlan: Plan = { title: '', promise: '', ending: '', scenes: [{ title: '', purpose: '' }, { title: '', purpose: '' }] }
const storageKey = 'pylothouse-academy-chapter-plan-v1'

export function ChapterPlanner() {
  const [plan, setPlan] = useState<Plan>(initialPlan)
  const [ready, setReady] = useState(false)
  const [storageAvailable, setStorageAvailable] = useState(true)
  const [message, setMessage] = useState('Your plan is saved only in this browser.')

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey)
      if (saved) {
        const parsed: unknown = JSON.parse(saved)
        if (typeof parsed !== 'object' || parsed === null || !('title' in parsed) || !('promise' in parsed) || !('ending' in parsed) || !('scenes' in parsed) || typeof parsed.title !== 'string' || typeof parsed.promise !== 'string' || typeof parsed.ending !== 'string' || !Array.isArray(parsed.scenes) || parsed.scenes.length < 1 || parsed.scenes.some((scene: unknown) => typeof scene !== 'object' || scene === null || !('title' in scene) || !('purpose' in scene) || typeof scene.title !== 'string' || typeof scene.purpose !== 'string')) {
          throw new Error('Saved chapter plan has an unexpected format.')
        }
        setPlan({ title: parsed.title, promise: parsed.promise, ending: parsed.ending, scenes: parsed.scenes })
      }
    } catch (error) {
      console.error('Could not restore the local chapter plan:', error)
      setStorageAvailable(false)
      setMessage('Local storage is unavailable or the saved plan could not be read. You can still use and export this plan while the page is open.')
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready || !storageAvailable) return
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(plan))
      setMessage('Saved on this device.')
    } catch (error) {
      console.error('Could not save the local chapter plan:', error)
      setStorageAvailable(false)
      setMessage('Could not save locally. Export a copy to keep your plan.')
    }
  }, [plan, ready, storageAvailable])

  function updateScene(index: number, field: keyof Scene, value: string) {
    setPlan((current) => ({ ...current, scenes: current.scenes.map((scene, sceneIndex) => sceneIndex === index ? { ...scene, [field]: value } : scene) }))
  }
  function exportPlan() {
    const text = [`CHAPTER PLAN: ${plan.title || 'Untitled'}`, '', `Chapter promise: ${plan.promise || '—'}`, `Ending / change: ${plan.ending || '—'}`, '', ...plan.scenes.map((scene, i) => `SCENE ${i + 1}: ${scene.title || 'Untitled scene'}\nPurpose: ${scene.purpose || '—'}`)].join('\n')
    let url = ''
    try {
      url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }))
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = 'chapter-plan.txt'
      anchor.click()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
      setMessage('Your text file is ready.')
    } catch (error) {
      if (url) URL.revokeObjectURL(url)
      console.error('Could not export the chapter plan:', error)
      setMessage('Could not export. Try copying the plan from your fields.')
    }
  }

  return <div className="planner-shell">
    <div className="planner-intro"><div><p className="eyebrow">A flexible 30-minute pass</p><h2>Give the idea<br /><em>a shape.</em></h2></div><p>Work in rough language. The goal is not a perfect outline—it’s one clear next step. Your entries stay in local browser storage on this device.</p></div>
    <div className="planner-fields">
      <label className="field-label">Chapter or project name<input value={plan.title} onChange={(event) => setPlan({ ...plan, title: event.target.value })} placeholder="A working title is fine" /></label>
      <label className="field-label">What is this chapter’s job?<textarea value={plan.promise} onChange={(event) => setPlan({ ...plan, promise: event.target.value })} placeholder="What should a reader understand, feel or wonder?" rows={3} /></label>
      <label className="field-label">What changes by the end?<textarea value={plan.ending} onChange={(event) => setPlan({ ...plan, ending: event.target.value })} placeholder="A choice, discovery, shift or new question…" rows={3} /></label>
    </div>
    <div className="scene-heading"><div><p className="eyebrow">The beat list</p><h3>Scenes & moments</h3></div><button className="button button-quiet" onClick={() => setPlan({ ...plan, scenes: [...plan.scenes, { title: '', purpose: '' }] })}>+ Add a scene</button></div>
    <div className="scene-list">{plan.scenes.map((scene, index) => <div className="scene-card" key={index}><span className="scene-number">{String(index + 1).padStart(2, '0')}</span><label className="field-label">Moment / scene<input value={scene.title} onChange={(event) => updateScene(index, 'title', event.target.value)} placeholder="What happens?" /></label><label className="field-label">What does it do?<input value={scene.purpose} onChange={(event) => updateScene(index, 'purpose', event.target.value)} placeholder="Why does the story need it?" /></label><button className="remove-scene" aria-label={`Remove scene ${index + 1}`} disabled={plan.scenes.length <= 1} onClick={() => setPlan({ ...plan, scenes: plan.scenes.filter((_, sceneIndex) => sceneIndex !== index) })}>×</button></div>)}</div>
    <div className="planner-actions"><span role="status" aria-live="polite">{message}</span><button className="button button-primary" onClick={exportPlan}>Export as text ↗</button></div>
  </div>
}
