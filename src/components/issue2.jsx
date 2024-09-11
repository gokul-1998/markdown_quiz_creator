import React, { useState } from 'react';
import { AlertCircle, Image as ImageIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';

const IssueCreator = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleBodyChange = (e) => setBody(e.target.value);

  const handleImagePaste = async (e) => {
    const items = e.clipboardData.items;
    const item = items[0];

    if (item && item.type.indexOf('image') !== -1) {
      setIsUploading(true);
      const blob = item.getAsFile();

      // Create a form data object for the image
      const formData = new FormData();
      formData.append('file', blob);

      try {
        // Send the image to FastAPI (which will upload it to Cloudinary)
        const response = await axios.post('http://localhost:8000/photo_upload/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // Get the URL from the response
        const imageUrl = response.data.url;
        setBody((prevBody) => `${prevBody}\n![Uploaded Image](${imageUrl})`);
        setIsUploading(false);
      } catch (error) {
        console.error('Error uploading image:', error);
        setErrorMessage('Failed to upload image.');
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would implement the logic to submit the issue
    console.log('Submitting issue:', { title, body });
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Issue title"
          className="w-full p-2 border rounded"
        />
        <div className="relative">
          <textarea
            value={body}
            onChange={handleBodyChange}
            onPaste={handleImagePaste}
            placeholder="Leave a comment"
            className="w-full p-2 border rounded min-h-[200px]"
          />
          {isUploading && (
            <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center">
              <p>Uploading image...</p>
            </div>
          )}
        </div>
        {errorMessage && (
          <div className="text-red-600">
            <p>{errorMessage}</p>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <ImageIcon size={20} />
          <span className="text-sm text-gray-600">
            Attach images by dragging & dropping, selecting, or pasting them.
          </span>
        </div>
        <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Submit new issue
        </button>
      </form>

      <Alert className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Note</AlertTitle>
        <AlertDescription>
          This is a basic implementation. Markdown parsing and Cloudinary integration is implemented. Check for any errors in image upload.
        </AlertDescription>
      </Alert>

      <div className="mt-6">
        <h2 className="text-xl font-bold">Preview:</h2>
        <div className="border p-4 rounded bg-gray-100">
          <ReactMarkdown>{body}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default IssueCreator;
