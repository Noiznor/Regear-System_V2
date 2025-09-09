import React, { useState, useRef, useEffect } from 'react';
import { MemberData, filterMembers } from '../utils/memberData';
import { User, Check } from 'lucide-react';

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  members: MemberData[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  value,
  onChange,
  members,
  placeholder = "Enter player name",
  className = "",
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredMembers, setFilteredMembers] = useState<MemberData[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const filtered = filterMembers(members, value);
    setFilteredMembers(filtered);
    setHighlightedIndex(-1);
  }, [value, members]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    if (value.trim()) {
      setIsOpen(true);
    }
  };

  const handleInputBlur = (e: React.FocusEvent) => {
    // Delay closing to allow clicking on dropdown items
    setTimeout(() => {
      if (!dropdownRef.current?.contains(e.relatedTarget as Node)) {
        setIsOpen(false);
      }
    }, 150);
  };

  const handleMemberSelect = (member: MemberData) => {
    onChange(member.name);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filteredMembers.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredMembers.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredMembers.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleMemberSelect(filteredMembers[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const isExactMatch = members.some(member => 
    member.name.toLowerCase() === value.toLowerCase()
  );

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          className={`${className} ${isExactMatch ? 'border-green-500 bg-green-50' : ''}`}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
        />
        {isExactMatch && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Check className="h-5 w-5 text-green-600" />
          </div>
        )}
      </div>

      {isOpen && filteredMembers.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-2xl max-h-60 overflow-y-auto"
        >
          {filteredMembers.map((member, index) => (
            <button
              key={member.id}
              type="button"
              onClick={() => handleMemberSelect(member)}
              className={`w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors duration-150 flex items-center space-x-3 ${
                index === highlightedIndex ? 'bg-blue-100' : ''
              } ${index === 0 ? 'rounded-t-xl' : ''} ${
                index === filteredMembers.length - 1 ? 'rounded-b-xl' : ''
              }`}
            >
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg p-2 shadow-lg">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-gray-900">{member.name}</div>
                <div className="text-sm text-gray-500">{member.guildName}</div>
              </div>
            </button>
          ))}
        </div>
      )}

      {isOpen && value.trim() && filteredMembers.length === 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-200 rounded-xl shadow-2xl p-4">
          <div className="text-center text-gray-500">
            <User className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="font-medium">No members found</p>
            <p className="text-sm">Try a different search term</p>
          </div>
        </div>
      )}
    </div>
  );
};
