import Link from 'next/link'
import EntryCard from '@/components/EntryCard'
import NewEntryCard from '@/components/NewEntryCard'
import { getUserByClertID } from '@/utils/auth'
import { prisma } from '@/utils/db'
import { analyze } from '@/utils/ai'
import Question from '@/components/Question'

const getEntries = async () => {
  const user = await getUserByClertID()
  const entries = await prisma.journalEntry.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      analysis: true,
    },
  })
  // await analyze(`I'm going to give you an journal entry, I want you to analyze it
  //    for a few things. I need the mood, a summary , what the subject is, and a
  //    color representing the mood. You need to respond back with formatted JSON
  //    like so: {"mood": "", "subject": "", "color": "", negative: ""}.

  //    entry:
  //    Today was a really great day. I finally was able to grab that pair of shoes
  //    I have been dying to get
  //    `)
  // const res = await analyze(
  //   'Today was a eh, ok day I guess. I found a new coffee shop that was cool but I got a flat tire. :)'
  // )
  // console.log('ZZZZ', res)
  return entries
}

const JournalPage = async () => {
  const entries = await getEntries()
  // console.log('entries', entries)
  return (
    <div className="p-10 bg-zinc-500/10">
      <h2 className="text-3xl mb-8">Journal</h2>
      <div className="my-8">
        <Question />
      </div>
      <div className="grid grid-cols-3 gap-4 p-10">
        <NewEntryCard />
        {entries.map((entry) => (
          <Link key={entry.id} href={`/journal/${entry.id}`}>
            <EntryCard entry={entry} />
          </Link>
        ))}
      </div>
    </div>
  )
}

export default JournalPage
