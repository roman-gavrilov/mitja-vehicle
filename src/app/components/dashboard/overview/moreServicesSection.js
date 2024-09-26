import { ArrowRightIcon } from '@heroicons/react/24/outline';

const MoreServicesSection = () => {
  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
      {/* Section Title */}
      <h2 className="text-2xl font-bold mb-6">More Services</h2>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border p-4 rounded-md flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">How much can I afford?</h3>
            <p className="text-gray-500">Thinking of financing? Calculate your monthly rate in just 5 minutes.</p>
          </div>
          <ArrowRightIcon className="h-6 w-6 text-blue-700" />
        </div>

        <div className="border p-4 rounded-md flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">Lease your dream car</h3>
            <p className="text-gray-500">Find hot deals on Germany&#39;s biggest vehicle marketplace.</p>
          </div>
          <ArrowRightIcon className="h-6 w-6 text-blue-700" />
        </div>

        <div className="border p-4 rounded-md flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">The mobile.de Magazin</h3>
            <p className="text-gray-500">Independent and objective. Test drive and tips (Only in German).</p>
          </div>
          <ArrowRightIcon className="h-6 w-6 text-blue-700" />
        </div>

        <div className="border p-4 rounded-md flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold">Trade with confidence</h3>
            <p className="text-gray-500">Bye-bye paperwork, here comes the digital sales contract!</p>
          </div>
          <ArrowRightIcon className="h-6 w-6 text-blue-700" />
        </div>
      </div>

      {/* Feedback Section */}
      <div className="mt-6 bg-gray-100 p-4 rounded-md flex justify-between items-center">
        <p className="text-lg">Did you find what you were looking for on this page?</p>
        <div className="flex space-x-4">
          <button className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg flex items-center">
            Yes
          </button>
          <button className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg flex items-center">
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoreServicesSection;
