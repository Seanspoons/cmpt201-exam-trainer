type UnitPickerOption<T extends string> = {
  id: T
  label: string
}

type UnitPickerProps<T extends string> = {
  options: Array<UnitPickerOption<T>>
  value: T
  onChange: (value: T) => void
}

export function UnitPicker<T extends string>({
  options,
  value,
  onChange,
}: UnitPickerProps<T>) {
  return (
    <div className="unit-picker">
      <label htmlFor="unit-picker-select" className="unit-picker-label">
        Unit
      </label>
      <select
        id="unit-picker-select"
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
