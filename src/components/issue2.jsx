import React, { useState, useRef, useEffect } from 'react';
import { AlertCircle, Image as ImageIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const IssueCreator = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const textAreaRef = useRef(null);

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleBodyChange = (e) => setBody(e.target.value);

  // Adjust the textarea height based on the content
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = 'auto'; // Reset height
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`; // Adjust height based on scrollHeight
    }
  }, [body]);

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

        // Add newlines before appending the image Markdown to ensure proper rendering
        setBody((prevBody) => `${prevBody}\n\n![Uploaded Image](${imageUrl})\n\n`);
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
    <div className="max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              ref={textAreaRef}
              value={body}
              onChange={handleBodyChange}
              onPaste={handleImagePaste}
              placeholder="Leave a comment"
              className="w-full p-2 border rounded resize-none overflow-hidden min-h-[100px]"
              style={{ minHeight: '100px' }} // Optional initial minHeight
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
              Attach images by   or pasting them.
            </span>
          </div>
          <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Submit new issue
          </button>

          
        </form>

        <div className="mt-6 md:mt-0">
          <h2 className="text-xl font-bold mb-2">Preview:</h2>
          <div className="border p-4 rounded bg-gray-100">
            <ReactMarkdown className="markdown text-left" remarkPlugins={[remarkGfm]}>{body}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueCreator;
