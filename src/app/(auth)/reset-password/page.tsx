import { ResetPasswordForm } from "@/app/(auth)/reset-password/reset-password-form"

type ResetPasswordPageProps = {
  searchParams?: Promise<{ token?: string }>
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined
  const token = resolvedSearchParams?.token ?? ""

  return <ResetPasswordForm token={token} />
}
