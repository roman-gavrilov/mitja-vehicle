export const handleInputChange = (setVehicleData, key, value) => {
  setVehicleData((prevState) => ({
    ...prevState,
    [key]: value,
  }));
};

export const isContinueDisabled = (vehicleData) => {
  const { year, make, model, expireDate } = vehicleData;
  return !(year && make && model && expireDate);
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