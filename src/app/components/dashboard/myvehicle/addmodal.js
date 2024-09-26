import { XCircleIcon, ArrowRightIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import Step1 from './addmodals/Step1';
import Step2 from './addmodals/Step2';
import Step3 from './addmodals/Step3';
import Step4 from './addmodals/Step4';
import { isContinueDisabled, handleFinalSubmit } from './addmodals/utils';

const AddVehicleModal = ({ isVisible, onClose }) => {
  const [step, setStep] = useState(1);
  const [vehicleData, setVehicleData] = useState({
    image: '',
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
  });

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

  const handleImageUpload = (uploadedImageLink) => {
    setVehicleData((prevState) => ({
      ...prevState,
      image: uploadedImageLink,
    }));
  };

  console.log('Vehicle Data:', vehicleData);

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
          <XCircleIcon className="h-6 w-6" />
        </button>

        {step === 1 && <Step1 onImageUpload={handleImageUpload} />}
        {step === 2 && <Step2 vehicleData={vehicleData} setVehicleData={setVehicleData} />}
        {step === 3 && <Step3 vehicleData={vehicleData} setVehicleData={setVehicleData} />}
        {step === 4 && <Step4 vehicleData={vehicleData} setVehicleData={setVehicleData} />}

        <div className="flex justify-between mt-4">
          {step > 1 && (
            <button onClick={handleBack} className="bg-gray-300 py-2 px-4 rounded text-gray-800">
              Back
            </button>
          )}
          <button
            onClick={step === 4 ? () => handleFinalSubmit(vehicleData) : handleContinue}
            className={`py-2 px-4 rounded-lg flex items-center justify-center ${
              isContinueDisabled(step, vehicleData) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            disabled={isContinueDisabled(step, vehicleData)}
          >
            <ArrowRightIcon className="h-4 w-4 mr-2" />
            {step === 4 ? 'Add' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddVehicleModal;
