export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative w-full">
      <svg
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none"
        fill="none" stroke="currentColor" viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
          d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search restaurants, cuisine, location…"
        className="w-full pl-10 pr-4 bg-white text-sm text-gray-800 placeholder-gray-400 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:border-transparent"
        style={{
          height: '46px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          focusRingColor: '#ff5c28',
        }}
        onFocus={(e) => { e.target.style.boxShadow = '0 0 0 3px rgba(255,92,40,0.15)'; }}
        onBlur={(e) => { e.target.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'; }}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 text-gray-500 hover:bg-gray-300 text-sm font-bold transition-colors"
        >
          ×
        </button>
      )}
    </div>
  );
}
