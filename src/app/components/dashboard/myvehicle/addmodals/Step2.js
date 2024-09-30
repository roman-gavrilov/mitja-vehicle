import Select from 'react-select';
import { makeOptions, modelOptions, customSelectStyles } from './constants';
import { handleInputChange } from './utils';

const Step2 = ({ vehicleData, setVehicleData }) => {
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 50 }, (_, i) => ({
    value: currentYear - i,
    label: (currentYear - i).toString()
  }));

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Vehicle Information</h2>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-semibold">Year</label>
        <Select
          options={yearOptions}
          onChange={(option) => handleInputChange(setVehicleData, 'year', option.value)}
          value={yearOptions.find((option) => option.value === vehicleData.year)}
          placeholder="Choose year"
          styles={customSelectStyles}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-semibold">Make</label>
        <Select
          options={makeOptions}
          onChange={(option) => handleInputChange(setVehicleData, 'make', option.value)}
          value={makeOptions.find((option) => option.value === vehicleData.make)}
          placeholder="Choose make"
          styles={customSelectStyles}
        />
      </div>

      {vehicleData.make && (
        <div className="mb-4">
          <label className="block mb-2 text-sm font-semibold">Model</label>
          <Select
            options={modelOptions[vehicleData.make]}
            onChange={(option) => handleInputChange(setVehicleData, 'model', option.value)}
            value={modelOptions[vehicleData.make]?.find((option) => option.value === vehicleData.model)}
            placeholder="Choose model"
            styles={customSelectStyles}
          />
        </div>
      )}

      <div className="mb-4">
        <label className="block mb-2 text-sm font-semibold">Expire Date</label>
        <input
          type="date"
          className="w-full p-2 border rounded"
          value={vehicleData.expireDate}
          onChange={(e) => handleInputChange(setVehicleData, 'expireDate', e.target.value)}
        />
      </div>
    </>
  );
};

export default Step2;