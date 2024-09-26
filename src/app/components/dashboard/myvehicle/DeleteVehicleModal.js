import { XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const DeleteVehicleModal = ({ isOpen, onClose, onDelete }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        {/* Close button */}
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
          <XCircleIcon className="h-6 w-6" />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-4">Delete Vehicle</h2>

        {/* Vehicle Info */}
        <div className="flex items-center mb-4">
          <svg className="h-6 w-6 text-gray-500 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C10.34 2 9 3.34 9 5c0 1.66 1.34 3 3 3s3-1.34 3-3c0-1.66-1.34-3-3-3zm0 4c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-6 6c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-6c0-1.1-.9-2-2-2H6zm0 2h12v6H6v-6zm0-2h12c1.1 0 2 .9 2 2v1H4v-1c0-1.1.9-2 2-2zm0-2h12c1.1 0 2 .9 2 2v1H4v-1c0-1.1.9-2 2-2z" />
          </svg>
          <span>Volkswagen 181</span>
        </div>

        {/* Warning Box */}
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
          <div className="flex items-start">
            <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600 mr-2" />
            <div>
              <strong>What you should know</strong>
              <p>Your Volkswagen 181 and all associated vehicle information will be permanently deleted. This action cannot be undone!</p>
            </div>
          </div>
        </div>

        {/* Data Deletion Info */}
        <div className="mb-4">
          <p>The following data will be deleted:</p>
          <ul className="list-disc list-inside">
            <li>Vehicle data</li>
            <li>Individual vehicle profile</li>
            <li>Vehicle evaluation</li>
            <li>Reminders</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col space-y-2">
          <button className="bg-red-600 text-white py-2 rounded-lg hover:bg-red-700">
            Delete Vehicle
          </button>
          <button onClick={onClose} className="bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteVehicleModal;
