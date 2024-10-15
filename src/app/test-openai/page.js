'use client';

import { useState, useEffect } from 'react';

export default function TestOpenAI() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gpt-4o-2024-08-06');
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);

  useEffect(() => {
    // Clear thumbnails when attachedFiles change
    setThumbnails([]);
    
    // Generate new thumbnails
    attachedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnails((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  }, [attachedFiles]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('model', selectedModel);
    attachedFiles.forEach((file, index) => {
      formData.append(`file`, file);
    });

    try {
      const response = await fetch('/api/test-openai', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachedFiles(files);
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Test OpenAI API</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="model" className="block mb-2 font-semibold">Select Model:</label>
          <select
            id="model"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="gpt-4o-2024-08-06">GPT-4o 2024/08/06</option>
            <option value="chatgpt-4o-latest">GPT-4o latest</option>
            <option value="gpt-4o">GPT-4o</option>
            <option value="gpt-4o-mini">GPT-4o mini</option>
            <option value="gpt-4o-mini-2024-07-18">GPT-4o mini 2024/7/18</option>
          </select>
        </div>
        <div>
          <label htmlFor="prompt" className="block mb-2 font-semibold">Enter your prompt:</label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows="4"
            className="w-full p-2 border rounded"
            placeholder="Enter your prompt here"
          />
        </div>
        <div>
          <label htmlFor="files" className="block mb-2 font-semibold">Attach Images:</label>
          <input
            type="file"
            id="files"
            onChange={handleFileChange}
            multiple
            accept="image/*"
            className="w-full p-2 border rounded"
          />
        </div>
        {thumbnails.length > 0 && (
          <div className="mt-4">
            <p className="font-semibold mb-2">Uploaded Images:</p>
            <div className="flex flex-wrap gap-2">
              {thumbnails.map((thumbnail, index) => (
                <img
                  key={index}
                  src={thumbnail}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-20 h-20 object-cover rounded"
                />
              ))}
            </div>
          </div>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
        >
          {isLoading ? 'Processing...' : 'Submit'}
        </button>
      </form>
      {result && (
        <div className="mt-6 border p-4 rounded bg-gray-50">
          <h2 className="text-xl font-semibold mb-2">Result:</h2>
          <p className="whitespace-pre-wrap">{result}</p>
        </div>
      )}
    </div>
  );
}