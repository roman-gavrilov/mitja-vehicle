export const makeOptions = [
  { value: 'Abarth', label: 'Abarth' },
  { value: 'Audi', label: 'Audi' },
  { value: 'BMW', label: 'BMW' },
  { value: 'Toyota', label: 'Toyota' },
  { value: 'Honda', label: 'Honda' },
];

export const modelOptions = {
  Abarth: [{ value: '124 Spider', label: '124 Spider' }],
  Audi: [{ value: 'A4', label: 'A4' }, { value: 'Q5', label: 'Q5' }],
  BMW: [{ value: 'X5', label: 'X5' }, { value: '320i', label: '320i' }],
  Toyota: [{ value: 'Corolla', label: 'Corolla' }, { value: 'Camry', label: 'Camry' }],
  Honda: [{ value: 'Civic', label: 'Civic' }, { value: 'Accord', label: 'Accord' }],
};

export const firstRegistrationOptions = [
  { value: 'January', label: 'January' },
  { value: 'February', label: 'February' },
  // Add other months
];

export const doorOptions = [
  { value: '2/3', label: '2/3' },
  { value: '4/5', label: '4/5' },
  { value: '6/7', label: '6/7' },
];

export const fuelOptions = [
  { value: 'Petrol', label: 'Petrol' },
  { value: 'Diesel', label: 'Diesel' },
  { value: 'Electric', label: 'Electric' },
];

export const motorPowerUnits = [
  { value: 'HP', label: 'HP' },
  { value: 'kW', label: 'kW' },
];

export const colorOptions = [
  { value: 'Red', label: 'Red', colorCode: '#FF0000' },
  { value: 'Blue', label: 'Blue', colorCode: '#0000FF' },
  { value: 'Black', label: 'Black', colorCode: '#000000' },
  { value: 'White', label: 'White', colorCode: '#FFFFFF' },
  { value: 'Silver', label: 'Silver', colorCode: '#C0C0C0' },
  { value: 'Green', label: 'Green', colorCode: '#008000' },
  { value: 'Gold', label: 'Gold', colorCode: '#FFD700' },
];

export const months = Array.from({ length: 12 }, (_, i) => ({
  value: new Date(0, i).toLocaleString('default', { month: 'long' }),
  label: new Date(0, i).toLocaleString('default', { month: 'long' }),
}));

export const years = Array.from({ length: 50 }, (_, i) => ({
  value: new Date().getFullYear() - i,
  label: new Date().getFullYear() - i,
}));

export const kilometerOptions = [
  { value: '5000', label: '5000 km' },
  { value: '10000', label: '10000 km' },
  { value: '15000', label: '15000 km' },
  { value: '20000', label: '20000 km' },
  { value: '30000', label: '30000 km' },
];

export const mileageWhenPurchasedOptions = [
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

export const customSelectStyles = {
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
    backgroundColor: state.isSelected ? '#007BFF' : state.isFocused ? '#e0e0e0' : '#fff',
    color: state.isSelected ? '#fff' : '#000',
    '&:hover': {
      backgroundColor: '#e0e0e0',
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#000',
  }),
};