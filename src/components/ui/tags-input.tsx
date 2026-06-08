'use client'

import { useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tag } from '@/components/ui/tag'

const MAX_TAGS = 5

interface TagsInputProps {
  label?: string
  value: string[]
  onChange: (tags: string[]) => void
  inputValue: string
  onInputChange: (value: string) => void
}

export function TagsInput({
  label = 'Tags',
  value,
  onChange,
  inputValue,
  onInputChange,
}: TagsInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const isAtLimit = value.length >= MAX_TAGS

  function addTag() {
    const newTag = inputValue.trim().toLowerCase()
    if (!newTag || value.includes(newTag) || isAtLimit) return
    onChange([...value, newTag])
    onInputChange('')
    inputRef.current?.focus()
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag))
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="tag-input">{label}</Label>
      <Input
        ref={inputRef}
        id="tag-input"
        value={inputValue}
        onChange={(e) => onInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add a tag and press Enter"
        maxLength={30}
        disabled={isAtLimit}
      />
      {isAtLimit && (
        <p className="text-xs text-muted-foreground">Maximum {MAX_TAGS} tags reached</p>
      )}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {value.map((tag) => (
            <Tag key={tag} label={tag} onRemove={() => removeTag(tag)} />
          ))}
        </div>
      )}
    </div>
  )
}
