import { Search } from 'lucide-react'
import { Input } from './input.tsx'

export function SearchBar({
  defaultValue,
  placeholderText,
  onValueChange,
}: SearchBarProps) {
  return (
    <div className="border-primary flex h-10 w-full items-center overflow-hidden rounded-md border">
      <div className="bg-primary flex h-full items-center">
        <Search className="mx-2 h-5 w-5" />
      </div>
      <Input
        defaultValue={defaultValue}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholderText ? placeholderText : 'Search...'}
        className="h-full w-full rounded-l-none border-0 p-2"
      />
    </div>
  )
}

type SearchBarProps = {
  defaultValue?: string
  placeholderText?: string
  onValueChange: (searchTerm: string) => void
}
