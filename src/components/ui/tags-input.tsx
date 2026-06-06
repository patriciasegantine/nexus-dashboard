'use client'

import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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

  function addTag() {
    const newTag = inputValue.trim().toLowerCase()
    if (!newTag || value.includes(newTag) || value.length >= 10) return
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
      <div className="flex gap-2">
        <Input
          ref={inputRef}
          id="tag-input"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a tag and press Enter"
          maxLength={30}
          disabled={value.length >= 10}
        />
        <Button
          type="button"
          variant="outline"
          onClick={addTag}
          disabled={!inputValue.trim() || value.length >= 10}
        >
          Add
        </Button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
