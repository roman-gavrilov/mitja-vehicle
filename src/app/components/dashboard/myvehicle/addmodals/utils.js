export const handleInputChange = (setVehicleData, key, value) => {
  setVehicleData((prevState) => ({
    ...prevState,
    [key]: value,
  }));
};

export const isContinueDisabled = (step, vehicleData) => {
  const { image, make, model, firstRegistration, doors, fuel, power, color, currentMileage, postcode } = vehicleData;
  if (step === 1) return !vehicleData.image;
  if (step === 2) return !(make && model && firstRegistration && doors && fuel && power);
  if (step === 3) return !color;
  if (step === 4) return !(currentMileage && postcode);
  return false;
};

export const handleFinalSubmit = async (vehicleData) => {
  try {
    const response = await fetch('/api/dashboard/vehicles/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vehicleData),
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

  location.reload();
};