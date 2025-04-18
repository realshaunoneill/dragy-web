"use client"

import { Check, ChevronsUpDown, Globe } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/src/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover"
import { cn } from "@/src/lib/utils"
import { useState } from "react"

export type Country = {
  id: string
  name: string
  code: string
}

interface CountrySwitcherProps {
  countries: Country[]
  selectedCountry: string
  onCountryChange: (countryId: string) => void
}

export function CountrySwitcher({ countries, selectedCountry, onCountryChange }: CountrySwitcherProps) {
  const [open, setOpen] = useState(false)

  const selectedCountryData = countries.find((country) => country.id === selectedCountry)

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-[180px] justify-between">
            {selectedCountryData ? selectedCountryData.name : "Select country..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[180px] p-0">
          <Command>
            <CommandInput placeholder="Search country..." />
            <CommandList>
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {countries.map((country) => (
                  <CommandItem
                    key={country.id}
                    value={country.name}
                    onSelect={() => {
                      onCountryChange(country.id)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn("mr-2 h-4 w-4", selectedCountry === country.id ? "opacity-100" : "opacity-0")}
                    />
                    {country.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
