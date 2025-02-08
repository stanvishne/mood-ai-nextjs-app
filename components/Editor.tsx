'use client'

import { updateEntry } from '@/utils/api'
import { useState } from 'react'
import { useAutosave } from '@/utils/useAutosave'
const Editor = ({ entry }: any) => {
  const [value, setValue] = useState(entry.content)
  const [isSaving, setIsSaving] = useState(false)
  const [analysis, setAnalysis] = useState(entry.analysis)

  const analysysData = [
    { name: 'Subject', value: analysis?.subject },
    { name: 'Summary', value: analysis?.summary },
    { name: 'Mood', value: analysis?.mood },
    { name: 'Negative', value: analysis?.negative ? 'True' : 'False' },
  ]

  useAutosave({
    data: value,
    onSave: async (_value: string) => {
      console.log('running save', _value)
      setIsSaving(true)
      const updated = await updateEntry(entry.id, _value)

      setAnalysis(updated?.analysis)
      setIsSaving(false)
    },
  })

  return (
    <div className="w-full h-full grid grid-cols-3">
      <div className="col-span-2">
        {isSaving && <p>...saving</p>}
        <textarea
          className="w-full h-full p-8 text-xl outline-none"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <div className="border-l border-black/10">
        <div
          className=" px-6 py-10"
          style={{ backgroundColor: entry?.analysis?.color }}
        >
          <h2 className="text-xl">Analysis</h2>
        </div>
        <div>
          <ul>
            {analysysData.map((item) => (
              <li
                key={item.name}
                className="px-2 py-4 flex items-center justify-between border-b border-t border-black/10"
              >
                <span className="text-lg font-semibold">{item.name}</span>
                <span>{item.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Editor
