import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/session'
import { AuthForm } from '@/components/auth-form'

export default async function SignUpPage() {
  const u = await getSessionUser()
  if (u) redirect('/')
  return <AuthForm mode="sign-up" />
}
