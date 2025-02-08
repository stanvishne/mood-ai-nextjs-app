import { prisma } from '@/utils/db'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
export const createNewUser = async () => {
  const user = await currentUser()

  const match = await prisma.user.findUnique({
    where: {
      clerkId: user?.id as string,
    },
  })
  if (!match && user) {
    console.log('! match')
    await prisma.user.create({
      data: {
        clerkId: user.id,
        email: user?.emailAddresses[0].emailAddress,
      },
    })
  }
  console.log('matched', match)
  redirect('/journal')
}

const NewUser = async () => {
  await createNewUser()
  return <div>...loading</div>
}

export default NewUser
