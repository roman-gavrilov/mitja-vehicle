import { XCircleIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import Step2 from './addmodals/Step2';
import { handleFinalSubmit, isContinueDisabled } from './addmodals/utils';

const AddVehicleModal = ({ isVisible, onClose }) => {
  const [vehicleData, setVehicleData] = useState({
    year: '',
    make: '',
    model: '',
    expireDate: '',
  });

  if (!isVisible) return null;

  const handleSubmit = async () => {
    await handleFinalSubmit(vehicleData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
          <XCircleIcon className="h-6 w-6" />
        </button>

        <Step2 vehicleData={vehicleData} setVehicleData={setVehicleData} />

        <div className="flex justify-end mt-4">
          <button
            onClick={handleSubmit}
            className={`py-2 px-4 rounded-lg flex items-center justify-center ${
              isContinueDisabled(vehicleData) ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            disabled={isContinueDisabled(vehicleData)}
          >
            Add Vehicle
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddVehicleModal;
