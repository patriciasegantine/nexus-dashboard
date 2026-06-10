'use client'

import { useSession } from 'next-auth/react'
import { useTransition, useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { UserAvatar } from '@/components/ui/user-avatar'
import { updateProfile } from '@/actions/settings'

export function ProfileSettings() {
  const { data: session, update } = useSession()
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (session?.user?.name) setName(session.user.name)
  }, [session?.user?.name])

  const isDirty = name !== (session?.user?.name ?? '')
  const isValid = name.trim().length >= 2

  function handleSave() {
    setError('')
    setSaved(false)
    const formData = new FormData()
    formData.set('name', name)

    startTransition(async () => {
      const result = await updateProfile(formData)
      if (!result.success) {
        setError(result.error)
        return
      }
      await update({ name: name.trim() })
      setSaved(true)
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Profile</h2>
        <p className="text-sm text-muted-foreground">Manage your personal information.</p>
      </div>

      <div className="flex items-start gap-5">
        <UserAvatar src={session?.user?.image} name={name || session?.user?.name || 'U'} size="xl" />

        <div className="flex-1 space-y-3">
          <div className="space-y-1">
            <Label htmlFor="profile-name">Name</Label>
            <div className="flex gap-2">
              <Input
                id="profile-name"
                value={name}
                onChange={(e) => { setName(e.target.value); setSaved(false) }}
                placeholder="Your name"
                className="h-9"
              />
              <Button
                onClick={handleSave}
                disabled={isPending || !isDirty || !isValid}
                size="sm"
                className="h-9 shrink-0"
              >
                {isPending ? 'Saving…' : 'Save'}
              </Button>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {saved && <p className="text-sm text-emerald-600">Name updated.</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="profile-email">Email</Label>
            <Input
              id="profile-email"
              value={session?.user?.email ?? ''}
              readOnly
              disabled
              className="h-9 cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
