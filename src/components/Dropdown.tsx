'use client';
import { Model } from '@/types/types';
import { useState } from 'react';

interface DropdownProps {
  models: Model[];
  onSelect: (model: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ models, onSelect }) => {
  const [selectedModel, setSelectedModel] = useState<string>(models.length > 0 ? models[0].name : "");

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = event.target.value;
    setSelectedModel(selected);
    onSelect(selected);
  };

  return (
    <div className="relative inline-block w-64">
      <select
        id="ollama-models"
        value={selectedModel}
        onChange={handleSelectChange}
        className="block appearance-none w-full bg-surface-2 text-white border border-surface-2-h hover:border-primary px-4 py-2 pr-8 rounded-lg shadow-md leading-tight focus:outline-none focus:ring focus:border-primary"
        disabled={models.length === 0}
      >
        {models.length > 0 ? (
          models.map((model) => (
            <option key={model.id} value={model.name} className="text-white">
              {model.name}
            </option>
          ))
        ) : (
          <option value="" disabled className="text-gray-500">
            No models available
          </option>
        )}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M7 10l5 5 5-5H7z" />
        </svg>
      </div>
    </div>
  );
};

export default Dropdown;
