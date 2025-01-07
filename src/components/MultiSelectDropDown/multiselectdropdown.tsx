import { useState } from 'react';

import { ChevronDown, ChevronUp } from 'lucide-react';

interface MultiSelectDropdownProps {
  label: string;
  options: { label: string; value: number | string }[];
  selectedOptions: number[];
  setSelectedOptions: React.Dispatch<React.SetStateAction<number[]>>;
  isOpen: boolean;
  toggleOpen: () => void;
  className?: string;
}
export const MultiSelectDropdown = ({
  label,
  options,
  selectedOptions,
  setSelectedOptions,
  isOpen,
  toggleOpen,
  className,
}: MultiSelectDropdownProps) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleOption = (value: any) => {
    if (selectedOptions.includes(value)) {
      setSelectedOptions(selectedOptions.filter((option) => option !== value));
    } else {
      setSelectedOptions([...selectedOptions, value]);
    }
  };

  return (
    <div className="relative inline-block text-left">
      {/* Trigger Button */}
      <button
        onClick={toggleOpen}
        className={`inline-flex w-full justify-between text-nowrap rounded-md border px-4 py-2 text-sm font-medium ${className}`}
      >
        <div className="flex items-center gap-2 opacity-90">
          <span>{label}</span>
          {isOpen ? <ChevronUp /> : <ChevronDown />}
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-10 mt-2 origin-top-right -translate-x-[32%] rounded-md border bg-slate-100 dark:bg-green-950 lg:w-[35vw]">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full rounded-t-md border-b p-2"
          />
          <div className="flex flex-wrap gap-2 p-4">
            {filteredOptions.map((option: any) => (
              <div
                key={option.value}
                onClick={() => toggleOption(option.value)}
                className={`cursor-pointer rounded-md border px-4 py-2 text-center text-sm ${
                  selectedOptions.includes(option.value)
                    ? 'border-blue-500 bg-blue-100 text-blue-800 dark:border-lime-500 dark:bg-lime-500 dark:text-lime-100'
                    : 'border-gray-300 hover:bg-gray-200 dark:bg-green-900 dark:text-white'
                }`}
              >
                {option.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
