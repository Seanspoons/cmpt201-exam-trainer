type TabOption<T extends string> = {
  id: T
  label: string
}

type TabNavProps<T extends string> = {
  options: Array<TabOption<T>>
  activeTab: T
  onChange: (tab: T) => void
}

export function TabNav<T extends string>({
  options,
  activeTab,
  onChange,
}: TabNavProps<T>) {
  return (
    <nav aria-label="Study topics">
      <div className="controls-row" role="tablist">
        {options.map((option) => (
          <button
            key={option.id}
            role="tab"
            aria-selected={activeTab === option.id}
            onClick={() => onChange(option.id)}
            style={{
              fontWeight: activeTab === option.id ? 700 : 400,
              borderColor: activeTab === option.id ? '#222' : '#777',
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
