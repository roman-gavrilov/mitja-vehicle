import React from 'react';
import Select from "react-select";

export const GreenCheckMark = () => (
  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
  </svg>
);

export const CustomSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    paddingRight: '0',
  }),
  container: (provided) => ({
    ...provided,
    position: 'relative',
  }),
};

export const renderSelectWithCheckMark = (options, value, onChange, placeholder, isDisabled = false) => (
  <div className="relative">
    <Select
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      isDisabled={isDisabled}
      styles={CustomSelectStyles}
    />
    {value && (
      <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
        <GreenCheckMark />
      </div>
    )}
  </div>
);

export const DoorSelector = ({ doors, handleInputChange }) => {
  const options = ["3", "4", "5"];

  return (
    <div className="relative">
      <label className="block text-sm mb-2 font-semibold">Number of Doors *</label>
      <div className="flex border rounded-md overflow-hidden">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => handleInputChange("doors", option)}
            className={`flex-1 p-2 text-center ${
              doors === option ? 'bg-blue-100' : 'bg-white'
            } border-r last:border-r-0`}
          >
            {option}
          </button>
        ))}
      </div>
      {doors && (
        <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
          <GreenCheckMark />
        </div>
      )}
    </div>
  );
};

export const ButtonGroup = ({ options, value, onChange, name, label }) => (
  <div className="relative">
    <label className="block text-sm mb-2 font-semibold">{label} *</label>
    <div className="flex border rounded-md overflow-hidden">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(name, option.value)}
          className={`flex-1 text-sm p-2 text-center ${
            value === option.value ? 'bg-blue-100' : 'bg-white'
          } border-r last:border-r-0`}
        >
          {option.label}
        </button>
      ))}
    </div>
    {value !== null && value !== "" && (
      <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
        <GreenCheckMark />
      </div>
    )}
  </div>
);

export const CountrySelect = ({ value, onChange }) => (
  <div className="relative">
    <label className="block text-sm mb-2 font-semibold">Country *</label>
    <Select
      options={[{ value: 'Germany', label: 'Germany' }]}
      value={{ value, label: value }}
      onChange={(selectedOption) => onChange("country", selectedOption.value)}
      styles={CustomSelectStyles}
    />
    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </div>
    {value && (
      <div className="absolute -right-8 top-1/2 transform -translate-y-1/2">
        <GreenCheckMark />
      </div>
    )}
  </div>
);