import HistoryChart from '@/components/HistoryCharts'
import { getUserByClertID } from '@/utils/auth'
import { prisma } from '@/utils/db'

const getData = async () => {
  const user = await getUserByClertID()
  const analysis = await prisma.analysis.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: 'asc',
    },
  })

  const sum = analysis.reduce((acc, cur) => acc + cur.sentimentScore, 0)
  const avg = Math.round(sum / analysis.length)
  return { avg, analysis }
}

const History = async () => {
  const { avg, analysis } = await getData()
  //   console.log('!!!', analysis)
  return (
    <div className="w-full h-full">
      <div className="h-full">{`Avg. Sentiment ${avg}`}</div>
      <HistoryChart data={analysis} />
    </div>
  )
}

export default History
