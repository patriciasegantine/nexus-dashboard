import { Separator } from '@/components/ui/separator'
import { DangerZone } from '@/components/settings/danger-zone'
import { ProfileSettings } from '@/components/settings/profile-settings'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and workspace preferences.</p>
      </div>

      <Separator />
      <ProfileSettings />
      <Separator />
      <DangerZone />
    </div>
  )
}
