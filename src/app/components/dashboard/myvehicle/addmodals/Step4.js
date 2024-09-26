import Select from 'react-select';
import { months, years, kilometerOptions, mileageWhenPurchasedOptions, customSelectStyles } from './constants';
import { handleInputChange } from './utils';

const Step4 = ({ vehicleData, setVehicleData }) => {
  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Vehicle Profile</h2>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-semibold">When did you buy the vehicle?</label>
        <div className="flex gap-4">
          <div className="w-1/2">
            <Select
              options={months}
              onChange={(option) => handleInputChange(setVehicleData, 'purchaseMonth', option.value)}
              value={months.find((option) => option.value === vehicleData.purchaseMonth)}
              placeholder="Month"
              styles={customSelectStyles}
            />
          </div>
          <div className="w-1/2">
            <Select
              options={years}
              onChange={(option) => handleInputChange(setVehicleData, 'purchaseYear', option.value)}
              value={years.find((option) => option.value === vehicleData.purchaseYear)}
              placeholder="Year"
              styles={customSelectStyles}
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-semibold">What was its mileage when purchased?</label>
        <Select
          options={mileageWhenPurchasedOptions}
          onChange={(selectedOption) => handleInputChange(setVehicleData, 'mileageWhenPurchased', selectedOption.value)}
          value={mileageWhenPurchasedOptions.find((option) => option.value === vehicleData.mileageWhenPurchased)}
          placeholder="Choose mileage"
          styles={customSelectStyles}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-semibold">Current mileage</label>
        <div className="flex items-center">
          <input
            type="number"
            className="w-full p-2 border rounded mr-2"
            placeholder="Mileage"
            value={vehicleData.currentMileage}
            onChange={(e) => handleInputChange(setVehicleData, 'currentMileage', e.target.value)}
          />
          <span className="ml-2">km</span>
        </div>
        <p className="text-xs text-gray-600 mt-1">
          In order to be able to determine the current market value, we need the mileage of your vehicle.
        </p>
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-semibold">How many kilometers do you drive a year?</label>
        <Select
          options={kilometerOptions}
          onChange={(option) => handleInputChange(setVehicleData, 'kilometersPerYear', option.value)}
          value={kilometerOptions.find((option) => option.value === vehicleData.kilometersPerYear)}
          placeholder="Choose"
          styles={customSelectStyles}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-semibold">General inspection valid until</label>
        <div className="flex gap-4">
          <div className="w-1/2">
            <Select
              options={months}
              onChange={(option) => handleInputChange(setVehicleData, 'inspectionMonth', option.value)}
              value={months.find((option) => option.value === vehicleData.inspectionMonth)}
              placeholder="Month"
              styles={customSelectStyles}
            />
          </div>
          <div className="w-1/2">
            <Select
              options={years}
              onChange={(option) => handleInputChange(setVehicleData, 'inspectionYear', option.value)}
              value={years.find((option) => option.value === vehicleData.inspectionYear)}
              placeholder="Year"
              styles={customSelectStyles}
            />
          </div>
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-semibold">Are you the sole user?</label>
        <div className="flex">
          <button
            className={`flex-1 py-2 mr-2 ${vehicleData.isSoleUser === 'Yes' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => handleInputChange(setVehicleData, 'isSoleUser', 'Yes')}
          >
            Yes
          </button>
          <button
            className={`flex-1 py-2 ${vehicleData.isSoleUser === 'No' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => handleInputChange(setVehicleData, 'isSoleUser', 'No')}
          >
            No
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-semibold">Your postcode</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Your postcode"
          value={vehicleData.postcode}
          onChange={(e) => handleInputChange(setVehicleData, 'postcode', e.target.value)}
        />
      </div>
    </>
  );
};

export default Step4;