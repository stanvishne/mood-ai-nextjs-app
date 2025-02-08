import { SignUp } from '@clerk/nextjs'

const SignUpPage = () => {
  // return <SignUp afterSignUpUrl="/new-user" />
  return <SignUp forceRedirectUrl="/new-user" />
}

export default SignUpPage
