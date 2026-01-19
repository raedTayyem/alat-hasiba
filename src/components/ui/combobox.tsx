import { Fragment, useState, useRef } from 'react'
import { Combobox as HeadlessCombobox, Transition } from '@headlessui/react'
import { Check, ChevronsUpDown } from '@/utils/icons'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

export interface ComboboxOption {
  value: string
  label: string
}

interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  width?: string
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder,
  className,
  disabled = false,
  width = "w-full"
}: ComboboxProps) {
  const { t } = useTranslation('common')
  const [query, setQuery] = useState('')
  const buttonRef = useRef<HTMLButtonElement>(null)
  const placeholderText = placeholder || t('common.selectOption')

  const filteredOptions =
    query === ''
      ? options
      : options.filter((option) =>
          option.label
            .toLowerCase()
            .replace(/\s+/g, '')
            .includes(query.toLowerCase().replace(/\s+/g, ''))
        )

  return (
    <div className={cn(width, className)}>
      <HeadlessCombobox value={value} onChange={onChange} disabled={disabled} nullable>
        {({ open }) => (
          <div className="relative mt-1">
            <div 
              className={cn(
                "relative w-full cursor-default overflow-hidden rounded-md border border-input bg-background dark:bg-gray-950 text-left focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 sm:text-sm shadow-sm",
                disabled && "opacity-50 cursor-not-allowed bg-muted"
              )}
              onClick={() => {
                if (!disabled && !open && buttonRef.current) {
                  buttonRef.current.click()
                }
              }}
            >
              <HeadlessCombobox.Input
                className="w-full border-none py-2 ps-3 pe-10 text-sm leading-5 text-foreground bg-transparent focus:ring-0 cursor-text"
                displayValue={(val: string) => {
                  const opt = options.find(o => o.value === val)
                  return opt ? opt.label : ''
                }}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={placeholderText}
                autoComplete="off"
              />
              <HeadlessCombobox.Button 
                ref={buttonRef}
                className="absolute inset-y-0 end-0 flex items-center pe-2 cursor-pointer"
              >
                <ChevronsUpDown
                  className="h-5 w-5 text-muted-foreground"
                  aria-hidden="true"
                />
              </HeadlessCombobox.Button>
            </div>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
              afterLeave={() => setQuery('')}
            >
              <HeadlessCombobox.Options className="absolute z-[9999] mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-950 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm border border-border">
                {filteredOptions.length === 0 && query !== '' ? (
                  <div className="relative cursor-default select-none px-4 py-2 text-muted-foreground">
                    {t('common.nothingFound')}
                  </div>
                ) : (
                  filteredOptions.map((option) => (
                    <HeadlessCombobox.Option
                      key={option.value}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 ps-10 pe-4 ${
                          active ? 'bg-primary/10 text-primary' : 'text-foreground'
                        }`
                      }
                      value={option.value}
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? 'font-medium' : 'font-normal'
                            }`}
                          >
                            {option.label}
                          </span>
                          {selected ? (
                            <span
                              className={`absolute inset-y-0 start-0 flex items-center ps-3 ${
                                active ? 'text-primary' : 'text-primary'
                              }`}
                            >
                              <Check className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </HeadlessCombobox.Option>
                  ))
                )}
              </HeadlessCombobox.Options>
            </Transition>
          </div>
        )}
      </HeadlessCombobox>
    </div>
  )
}
