import { XCircleIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import Select from 'react-select';
import ImageUpload from './imageupload';

const AddVehicleModal = ({ isVisible, onClose }) => {
  const [step, setStep] = useState(1); // Track current step
  const [vehicleData, setVehicleData] = useState({
    make: '',
    model: '',
    firstRegistration: '',
    doors: '',
    fuel: '',
    power: '',
    powerUnit: 'HP',
    color: '',
    metallic: false,
    purchaseMonth: '',
    purchaseYear: '',
    mileageWhenPurchased: '',
    currentMileage: '',
    kilometersPerYear: '',
    inspectionMonth: '',
    inspectionYear: '',
    isSoleUser: '',
    postcode: '',
  }); // Store all form data in a single object

  if (!isVisible) return null;

  const handleContinue = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const makeOptions = [
    { value: 'Abarth', label: 'Abarth' },
    { value: 'Audi', label: 'Audi' },
    { value: 'BMW', label: 'BMW' },
    { value: 'Toyota', label: 'Toyota' },
    { value: 'Honda', label: 'Honda' },
  ];

  const modelOptions = {
    Abarth: [{ value: '124 Spider', label: '124 Spider' }],
    Audi: [{ value: 'A4', label: 'A4' }, { value: 'Q5', label: 'Q5' }],
    BMW: [{ value: 'X5', label: 'X5' }, { value: '320i', label: '320i' }],
    Toyota: [{ value: 'Corolla', label: 'Corolla' }, { value: 'Camry', label: 'Camry' }],
    Honda: [{ value: 'Civic', label: 'Civic' }, { value: 'Accord', label: 'Accord' }],
  };

  const firstRegistrationOptions = [
    { value: 'January', label: 'January' },
    { value: 'February', label: 'February' },
    // Add other months
  ];

  const doorOptions = [
    { value: '2/3', label: '2/3' },
    { value: '4/5', label: '4/5' },
    { value: '6/7', label: '6/7' },
  ];

  const fuelOptions = [
    { value: 'Petrol', label: 'Petrol' },
    { value: 'Diesel', label: 'Diesel' },
    { value: 'Electric', label: 'Electric' },
  ];

  const motorPowerUnits = [
    { value: 'HP', label: 'HP' },
    { value: 'kW', label: 'kW' },
  ];

  const colorOptions = [
    { value: 'Red', label: 'Red', colorCode: '#FF0000' },
    { value: 'Blue', label: 'Blue', colorCode: '#0000FF' },
    { value: 'Black', label: 'Black', colorCode: '#000000' },
    { value: 'White', label: 'White', colorCode: '#FFFFFF' },
    { value: 'Silver', label: 'Silver', colorCode: '#C0C0C0' },
    { value: 'Green', label: 'Green', colorCode: '#008000' },
    { value: 'Gold', label: 'Gold', colorCode: '#FFD700' },
  ];

  // Update state for form fields
  const handleInputChange = (key, value) => {
    setVehicleData((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  // Function to check if all required fields are filled for the current step
  const isContinueDisabled = () => {
    const { make, model, firstRegistration, doors, fuel, power, color, currentMileage, postcode } = vehicleData;
    if (step === 1) return false; // No conditions for step 1
    if (step === 2) return !(make && model && firstRegistration && doors && fuel && power);
    if (step === 3) return !color; // Ensure color is selected in step 3
    if (step === 4) return !(currentMileage && postcode); // Ensure required fields are filled in step 4
    return false;
  };

  // Options for select dropdowns
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: new Date(0, i).toLocaleString('default', { month: 'long' }),
    label: new Date(0, i).toLocaleString('default', { month: 'long' }),
  }));

  const years = Array.from({ length: 50 }, (_, i) => ({
    value: new Date().getFullYear() - i,
    label: new Date().getFullYear() - i,
  }));

  const kilometerOptions = [
    { value: '5000', label: '5000 km' },
    { value: '10000', label: '10000 km' },
    { value: '15000', label: '15000 km' },
    { value: '20000', label: '20000 km' },
    { value: '30000', label: '30000 km' },
  ];

  const mileageWhenPurchasedOptions = [
    { "value": "<1000", "label": "Less than 1,000 km" },
    { "value": "5000", "label": "5,000 km" },
    { "value": "10000", "label": "10,000 km" },
    { "value": "15000", "label": "15,000 km" },
    { "value": "20000", "label": "20,000 km" },
    { "value": "25000", "label": "25,000 km" },
    { "value": "30000", "label": "30,000 km" },
    { "value": "35000", "label": "35,000 km" },
    { "value": "40000", "label": "40,000 km" },
    { "value": "45000", "label": "45,000 km" },
    { "value": "50000", "label": "50,000 km" },
    { "value": "55000", "label": "55,000 km" },
    { "value": "60000", "label": "60,000 km" },
    { "value": "65000", "label": "65,000 km" },
    { "value": "70000", "label": "70,000 km" },
    { "value": "75000", "label": "75,000 km" },
    { "value": "80000", "label": "80,000 km" },
    { "value": "85000", "label": "85,000 km" },
    { "value": "90000", "label": "90,000 km" },
    { "value": "95000", "label": "95,000 km" },
    { "value": "100000", "label": "100,000 km" }
  ];

  const handleFinalSubmit = async () => {
    try {
      const response = await fetch('/api/dashboard/vehicles/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vehicleData), // Send vehicle data to the API
        credentials: 'include'
      });
  
      const result = await response.json();
  
      if (response.ok) {
        console.log('Vehicle data submitted successfully:', result);
      } else {
        console.error('Failed to submit vehicle data:', result.error);
      }
    } catch (error) {
      console.error('Error submitting vehicle data:', error);
    }
  
    location.reload(); // Close the modal after submission
  };
  

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        {/* Close button */}
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
          <XCircleIcon className="h-6 w-6" />
        </button>

        {/* Modal content based on step */}
        {step === 1 && (
          <>
            <h2 className="text-2xl font-bold mb-4">Add my vehicle</h2>
            <ImageUpload />
            <p className="mt-4 text-sm">Please upload your vehicle image, and we will extract the vehicle information.</p>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-2xl font-bold mb-4">Vehicle Information</h2>

            {/* Make Dropdown */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold">Make</label>
              <Select
                options={makeOptions}
                onChange={(option) => handleInputChange('make', option.value)}
                value={makeOptions.find((option) => option.value === vehicleData.make)} // Set value for make
                placeholder="Choose make"
                styles={customSelectStyles}
              />
            </div>

            {/* Model Dropdown (conditionally shown when Make is selected) */}
            {vehicleData.make && (
              <div className="mb-4">
                <label className="block mb-2 text-sm font-semibold">Model</label>
                <Select
                  options={modelOptions[vehicleData.make]}
                  onChange={(option) => handleInputChange('model', option.value)}
                  value={modelOptions[vehicleData.make]?.find((option) => option.value === vehicleData.model)} // Set value for model
                  placeholder="Choose model"
                  styles={customSelectStyles}
                />
              </div>
            )}

            {/* Display additional fields once both Make and Model are selected */}
            {vehicleData.model && (
              <>
                {/* First Registration */}
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-semibold">First Registration</label>
                  <Select
                    options={firstRegistrationOptions}
                    placeholder="Choose registration month"
                    onChange={(option) => handleInputChange('firstRegistration', option.value)}
                    value={firstRegistrationOptions.find((option) => option.value === vehicleData.firstRegistration)} // Set value for firstRegistration
                    styles={customSelectStyles}
                  />
                </div>

                {/* Doors */}
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-semibold">Doors</label>
                  <Select
                    options={doorOptions}
                    placeholder="Select number of doors"
                    onChange={(option) => handleInputChange('doors', option.value)}
                    value={doorOptions.find((option) => option.value === vehicleData.doors)} // Set value for doors
                    styles={customSelectStyles}
                  />
                </div>

                {/* Fuel */}
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-semibold">Fuel</label>
                  <Select
                    options={fuelOptions}
                    placeholder="Select fuel type"
                    onChange={(option) => handleInputChange('fuel', option.value)}
                    value={fuelOptions.find((option) => option.value === vehicleData.fuel)} // Set value for fuel
                    styles={customSelectStyles}
                  />
                </div>

                {/* Motor Power */}
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-semibold">Motor Power</label>
                  <div className="flex">
                    <input
                      type="number"
                      className="w-full p-2 border rounded mr-2"
                      placeholder="Enter power"
                      value={vehicleData.power} // Set value for power
                      onChange={(e) => handleInputChange('power', e.target.value)}
                    />
                    <Select
                      options={motorPowerUnits}
                      defaultValue={motorPowerUnits[0]}
                      onChange={(option) => handleInputChange('powerUnit', option.value)}
                      value={motorPowerUnits.find((option) => option.value === vehicleData.powerUnit)} // Set value for powerUnit
                      styles={customSelectStyles}
                      className="w-32"
                    />
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-2xl font-bold mb-4">Select Vehicle Color</h2>
            <div className="grid grid-cols-4 gap-4 mb-4">
              {colorOptions.map((color) => (
                <div
                  key={color.value}
                  className={`w-12 h-12 rounded-full cursor-pointer ${vehicleData.color === color.value ? 'ring-4 ring-blue-500' : ''}`}
                  style={{ backgroundColor: color.colorCode }}
                  onClick={() => handleInputChange('color', color.value)}
                  title={color.label}
                />
              ))}
            </div>

            {/* Metallic Checkbox */}
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="metallic"
                checked={vehicleData.metallic}
                onChange={(e) => handleInputChange('metallic', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="metallic" className="text-gray-700">Metallic</label>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <h2 className="text-2xl font-bold mb-4">Vehicle Profile</h2>

            {/* Purchase Date */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold">When did you buy the vehicle?</label>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <Select
                    options={months}
                    onChange={(option) => handleInputChange('purchaseMonth', option.value)}
                    value={months.find((option) => option.value === vehicleData.purchaseMonth)}
                    placeholder="Month"
                    styles={customSelectStyles}
                  />
                </div>
                <div className="w-1/2">
                  <Select
                    options={years}
                    onChange={(option) => handleInputChange('purchaseYear', option.value)}
                    value={years.find((option) => option.value === vehicleData.purchaseYear)}
                    placeholder="Year"
                    styles={customSelectStyles}
                  />
                </div>
              </div>
            </div>

            {/* Mileage When Purchased */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold">What was its mileage when purchased?</label>
              <Select
                options={mileageWhenPurchasedOptions} // Use the JSON options
                onChange={(selectedOption) => handleInputChange('mileageWhenPurchased', selectedOption.value)} // Update state on change
                value={mileageWhenPurchasedOptions.find((option) => option.value === vehicleData.mileageWhenPurchased)} // Set current value
                placeholder="Choose mileage"
                styles={customSelectStyles} // Custom styles for react-select (if any)
              />
            </div>

            {/* Current Mileage */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold">Current mileage</label>
              <div className="flex items-center">
                <input
                  type="number"
                  className="w-full p-2 border rounded mr-2"
                  placeholder="Mileage"
                  value={vehicleData.currentMileage}
                  onChange={(e) => handleInputChange('currentMileage', e.target.value)}
                />
                <span className="ml-2">km</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">
                In order to be able to determine the current market value, we need the mileage of your vehicle.
              </p>
            </div>


            {/* Kilometers per Year */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold">How many kilometers do you drive a year?</label>
              <Select
                options={kilometerOptions}
                onChange={(option) => handleInputChange('kilometersPerYear', option.value)}
                value={kilometerOptions.find((option) => option.value === vehicleData.kilometersPerYear)}
                placeholder="Choose"
                styles={customSelectStyles}
              />
            </div>

            {/* General Inspection Valid Until */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold">General inspection valid until</label>
              <div className="flex gap-4">
                <div className="w-1/2">
                  <Select
                    options={months}
                    onChange={(option) => handleInputChange('inspectionMonth', option.value)}
                    value={months.find((option) => option.value === vehicleData.inspectionMonth)}
                    placeholder="Month"
                    styles={customSelectStyles}
                  />
                </div>
                <div className="w-1/2">
                  <Select
                    options={years}
                    onChange={(option) => handleInputChange('inspectionYear', option.value)}
                    value={years.find((option) => option.value === vehicleData.inspectionYear)}
                    placeholder="Year"
                    styles={customSelectStyles}
                  />
                </div>
              </div>
            </div>

            {/* Sole User Toggle */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold">Are you the sole user?</label>
              <div className="flex">
                <button
                  className={`flex-1 py-2 mr-2 ${vehicleData.isSoleUser === 'Yes' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                  onClick={() => handleInputChange('isSoleUser', 'Yes')}
                >
                  Yes
                </button>
                <button
                  className={`flex-1 py-2 ${vehicleData.isSoleUser === 'No' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                  onClick={() => handleInputChange('isSoleUser', 'No')}
                >
                  No
                </button>
              </div>
            </div>

            {/* Postcode */}
            <div className="mb-4">
              <label className="block mb-2 text-sm font-semibold">Your postcode</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="Your postcode"
                value={vehicleData.postcode}
                onChange={(e) => handleInputChange('postcode', e.target.value)}
              />
            </div>
          </>
        )}

        {/* Buttons for navigating steps */}
        <div className="flex justify-between mt-4">
          {step > 1 && (
            <button onClick={handleBack} className="bg-gray-300 py-2 px-4 rounded text-gray-800">
              Back
            </button>
          )}
          <button
            onClick={step === 4 ? handleFinalSubmit : handleContinue}
            className={`py-2 px-4 rounded-lg flex items-center justify-center ${
              isContinueDisabled() ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            disabled={isContinueDisabled()}
          >
            <ArrowRightIcon className="h-4 w-4 mr-2" /> {/* Small right arrow icon */}
            {step === 4 ? 'Add' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddVehicleModal;

// Custom styles for react-select
const customSelectStyles = {
  control: (provided) => ({
    ...provided,
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '2px',
    boxShadow: 'none',
    '&:hover': {
      borderColor: '#888',
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? '#007BFF' : state.isFocused ? '#e0e0e0' : '#fff', // Better contrast for selected and focused options
    color: state.isSelected ? '#fff' : '#000', // White text on blue background when selected
    '&:hover': {
      backgroundColor: '#e0e0e0', // Slight gray hover effect
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#000', // Ensure the selected value is clearly visible
  }),
};
