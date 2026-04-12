type TabOption<T extends string> = {
  id: T
  label: string
}

type TabNavProps<T extends string> = {
  options: Array<TabOption<T>>
  activeTab: T
  onChange: (tab: T) => void
  variant?: 'unit' | 'subtopic'
}

export function TabNav<T extends string>({
  options,
  activeTab,
  onChange,
  variant = 'unit',
}: TabNavProps<T>) {
  return (
    <nav
      aria-label="Study topics"
      className={`tab-nav tab-nav--${variant}`}
    >
      <div className="controls-row tab-row" role="tablist">
        {options.map((option) => (
          <button
            key={option.id}
            role="tab"
            aria-selected={activeTab === option.id}
            onClick={() => onChange(option.id)}
            className={`tab-button ${
              activeTab === option.id ? 'tab-button--active' : ''
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
