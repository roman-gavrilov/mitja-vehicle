import ImageUpload from '../imageupload';

const Step1 = ({ onImageUpload }) => {
  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Add my vehicle</h2>
      <ImageUpload onImageUpload={onImageUpload} />
      <p className="mt-4 text-sm">Please upload your vehicle image, and we will extract the vehicle information.</p>
    </>
  );
};

export default Step1;