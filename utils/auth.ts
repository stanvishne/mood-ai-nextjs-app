import { auth } from '@clerk/nextjs/server'
import { prisma } from './db'

export const getUserByClertID = async () => {
  const { userId } = await auth()

  const user = await prisma.user.findFirstOrThrow({
    where: {
      clerkId: userId as string,
    },
  })
  return user
}
