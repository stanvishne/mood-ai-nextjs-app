'use client'

import { createNewEntry } from '@/utils/api'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const NewEntryCard = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const handleClick = async () => {
    setLoading(true)
    const data = await createNewEntry()
    setLoading(false)
    router.push(`/journal/${data.id}`)
  }
  return (
    <div className="cursor-pointer overflow-hidden rounded-lg bg-white shadow p-5">
      {!loading && (
        <div
          className="px-4 py-5 sm:p-6 hover:bg-sky-100"
          onClick={handleClick}
        >
          <span className="text-3xl">New Entry</span>
        </div>
      )}
      {loading && <div className="px-4 py-5 sm:p-6">working ... </div>}
    </div>
  )
}

export default NewEntryCard
