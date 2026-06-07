'use client'

import * as React from 'react'
import { addDays, addMonths, format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

interface DatePickerProps {
  value: Date | undefined
  onChange: (date: Date | undefined) => void
  placeholder?: string
  className?: string
}

const shortcuts: { label: string; getDate: () => Date }[] = [
  { label: 'Today',      getDate: () => new Date() },
  { label: 'Tomorrow',   getDate: () => addDays(new Date(), 1) },
  { label: 'In 3 days',  getDate: () => addDays(new Date(), 3) },
  { label: 'In a week',  getDate: () => addDays(new Date(), 7) },
  { label: 'In 2 weeks', getDate: () => addDays(new Date(), 14) },
  { label: '1 month',    getDate: () => addMonths(new Date(), 1) },
]

export function DatePicker({ value, onChange, placeholder = 'Pick a date', className }: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  function handleSelect(date: Date | undefined) {
    onChange(date)
    setOpen(false)
  }

  function handleShortcut(getDate: () => Date) {
    onChange(getDate())
    setOpen(false)
  }

  return (
    // modal prop fixes Radix Popover click-through when rendered inside a Radix Dialog
    <Popover open={open} onOpenChange={setOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !value && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, 'PPP') : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleSelect}
          autoFocus
        />
        <div className="border-t p-3 space-y-1.5">
          <div className="grid grid-cols-3 gap-1.5">
            {shortcuts.slice(0, 3).map(({ label, getDate }) => (
              <Button key={label} variant="outline" size="sm" className="text-xs" onClick={() => handleShortcut(getDate)}>
                {label}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {shortcuts.slice(3).map(({ label, getDate }) => (
              <Button key={label} variant="outline" size="sm" className="text-xs" onClick={() => handleShortcut(getDate)}>
                {label}
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
