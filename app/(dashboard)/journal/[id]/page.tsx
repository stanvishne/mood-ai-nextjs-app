import Editor from '@/components/Editor'
import { getUserByClertID } from '@/utils/auth'
import { prisma } from '@/utils/db'

const getEntry = async (id: string) => {
  const user = await getUserByClertID()
  const entry = prisma.journalEntry.findUnique({
    where: {
      userId_id: {
        userId: user.id,
        id,
      },
    },
    include: {
      analysis: true,
    },
  })
  return entry
}

const EntryPage = async ({ params }: { params: { id: string } }) => {
  const { id } = await params
  const entry = await getEntry(id)

  return (
    <div className="w-full h-full">
      <Editor entry={entry} />
    </div>
  )
}

export default EntryPage
