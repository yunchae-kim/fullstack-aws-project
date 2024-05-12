import React, { useState } from 'react';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://nmoj4ij1e2.execute-api.us-east-1.amazonaws.com/prod/',
});

function UploadForm() {
  // States for text input and file input
  const [inputText, setInputText] = useState('');
  const [inputFile, setInputFile] = useState(null);

  // Event handlers for text input and file input
  const handleTextInput = (event) => {
    setInputText(event.target.value);
  };

  const handleFileInput = (event) => {
    setInputFile(event.target.files[0]);
  };

  // Event handler for form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Upload the file to S3
      const uploadResponse = await apiClient.put('file', {
        fileName: inputFile.name,
        fileContent: inputFile,
      });

      const fileUrl = uploadResponse.data.url;

      // Save the input text and file path to DynamoDB
      await apiClient.post('file', {
        input_text: inputText,
        input_file_path: fileUrl,
      });

      alert('File uploaded and data saved successfully.');
    } catch (error) {
      console.error('Error uploading file or saving data:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="">
      <div>
        <label
          htmlFor="inputText"
          className="inline-block text-sm font-medium text-gray-800 mr-4 mb-4"
        >
          Text Input:
        </label>
        <input
          type="text"
          id="inputText"
          value={inputText}
          onChange={handleTextInput}
          className="inline-block w-64 px-2 py-1 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-400 focus:border-blue-400"
        />
      </div>

      <div>
        <label
          htmlFor="inputFile"
          className="inline-block text-sm font-medium text-gray-800 mr-4 mb-4"
        >
          File Input:
        </label>
        <input
          type="file"
          id="inputFile"
          onChange={handleFileInput}
          className="inline-block w-64 px-2 py-1 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
        />
      </div>

      <button
        type="submit"
        className="inline-flex justify-center py-1 px-2 text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400"
      >
        Submit
      </button>
    </form>
  );
}

export default UploadForm;
