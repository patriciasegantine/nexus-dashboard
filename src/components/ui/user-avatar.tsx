import Image from 'next/image'
import { cn } from '@/lib/utils'

type AvatarSize = 'sm' | 'md' | 'lg' | 'xl'

type UserAvatarProps = {
  src?: string | null
  name: string
  size?: AvatarSize
  className?: string
}

const SIZE_CLASSES: Record<AvatarSize, string> = {
  sm: 'h-6 w-6 text-xs',
  md: 'h-8 w-8 text-sm',
  lg: 'h-10 w-10 text-base',
  xl: 'h-16 w-16 text-xl',
}

const SIZE_PX: Record<AvatarSize, number> = {
  sm: 24,
  md: 32,
  lg: 40,
  xl: 64,
}

export function UserAvatar({ src, name, size = 'md', className }: UserAvatarProps) {
  const initial = name.trim()[0]?.toUpperCase() ?? 'U'
  const px = SIZE_PX[size]

  return (
    <div className={cn('rounded-full shrink-0 overflow-hidden', SIZE_CLASSES[size], className)}>
      {src ? (
        <Image
          src={src}
          alt={name}
          width={px}
          height={px}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center bg-zinc-600">
          <span className="text-white font-medium leading-none select-none">{initial}</span>
        </div>
      )}
    </div>
  )
}
