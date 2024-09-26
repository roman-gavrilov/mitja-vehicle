import { colorOptions } from './constants';
import { handleInputChange } from './utils';

const Step3 = ({ vehicleData, setVehicleData }) => {
  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Select Vehicle Color</h2>
      <div className="grid grid-cols-4 gap-4 mb-4">
        {colorOptions.map((color) => (
          <div
            key={color.value}
            className={`w-12 h-12 rounded-full cursor-pointer ${vehicleData.color === color.value ? 'ring-4 ring-blue-500' : ''}`}
            style={{ backgroundColor: color.colorCode }}
            onClick={() => handleInputChange(setVehicleData, 'color', color.value)}
            title={color.label}
          />
        ))}
      </div>

      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="metallic"
          checked={vehicleData.metallic}
          onChange={(e) => handleInputChange(setVehicleData, 'metallic', e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="metallic" className="text-gray-700">Metallic</label>
      </div>
    </>
  );
};

export default Step3;