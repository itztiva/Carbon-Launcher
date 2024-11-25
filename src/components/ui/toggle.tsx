export function Toggle({ checked, onChange }: { checked: boolean, onChange: (value: boolean) => void }) {
    return (
        <button
            className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 ${checked ? 'bg-indigo-600' : 'bg-zinc-700'
                }`}
            onClick={() => onChange(!checked)}
        >
            <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${checked ? 'translate-x-6' : 'translate-x-0'
                    }`}
            />
        </button>
    )
}
