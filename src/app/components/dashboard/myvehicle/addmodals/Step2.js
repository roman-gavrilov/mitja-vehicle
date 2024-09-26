import Select from 'react-select';
import { makeOptions, modelOptions, firstRegistrationOptions, doorOptions, fuelOptions, motorPowerUnits, customSelectStyles } from './constants';
import { handleInputChange } from './utils';

const Step2 = ({ vehicleData, setVehicleData }) => {
  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Vehicle Information</h2>

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

      {vehicleData.model && (
        <>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-semibold">First Registration</label>
            <Select
              options={firstRegistrationOptions}
              placeholder="Choose registration month"
              onChange={(option) => handleInputChange(setVehicleData, 'firstRegistration', option.value)}
              value={firstRegistrationOptions.find((option) => option.value === vehicleData.firstRegistration)}
              styles={customSelectStyles}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-semibold">Doors</label>
            <Select
              options={doorOptions}
              placeholder="Select number of doors"
              onChange={(option) => handleInputChange(setVehicleData, 'doors', option.value)}
              value={doorOptions.find((option) => option.value === vehicleData.doors)}
              styles={customSelectStyles}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-semibold">Fuel</label>
            <Select
              options={fuelOptions}
              placeholder="Select fuel type"
              onChange={(option) => handleInputChange(setVehicleData, 'fuel', option.value)}
              value={fuelOptions.find((option) => option.value === vehicleData.fuel)}
              styles={customSelectStyles}
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-sm font-semibold">Motor Power</label>
            <div className="flex">
              <input
                type="number"
                className="w-full p-2 border rounded mr-2"
                placeholder="Enter power"
                value={vehicleData.power}
                onChange={(e) => handleInputChange(setVehicleData, 'power', e.target.value)}
              />
              <Select
                options={motorPowerUnits}
                defaultValue={motorPowerUnits[0]}
                onChange={(option) => handleInputChange(setVehicleData, 'powerUnit', option.value)}
                value={motorPowerUnits.find((option) => option.value === vehicleData.powerUnit)}
                styles={customSelectStyles}
                className="w-32"
              />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Step2;