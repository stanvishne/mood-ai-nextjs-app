'use client'
import { askQuestion } from '@/utils/api'
import { useState } from 'react'

const Question = () => {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState('')

  const onChange = (e: any) => {
    setValue(e.target.value)
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    setResponse('')
    const answer = await askQuestion(value)
    setValue('')
    setLoading(false)
    setResponse(answer)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          disabled={loading}
          className="border border-black/20 px-4 py-2 text-lg"
          type="text"
          placeholder="Ask a quesytion"
          value={value}
          onChange={onChange}
        />
        <button
          disabled={loading}
          className="bg-blue-400 px-4 py-2 mx-4 rounded-lg text-lg"
        >
          Ask
        </button>
      </form>
      {loading && <div>loading...</div>}
      {response && <div>{response}</div>}
    </div>
  )
}

export default Question
