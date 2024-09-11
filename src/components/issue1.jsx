import React, { useState } from 'react';
import { AlertCircle, Image as ImageIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const IssueCreator = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleBodyChange = (e) => setBody(e.target.value);

  const handleImagePaste = async (e) => {
    const items = e.clipboardData.items;
    const item = items[0];

    if (item.type.indexOf('image') !== -1) {
      setIsUploading(true);
      const blob = item.getAsFile();
      
      // Here you would implement the Cloudinary upload logic
      // For demonstration, we're just simulating an upload
      setTimeout(() => {
        setBody(body + '\n![Uploaded Image](https://placeholder.com/image.jpg)');
        setIsUploading(false);
      }, 2000);
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
        <div className="flex items-center space-x-2">
          <ImageIcon size={20} />
          <span className="text-sm text-gray-600">Attach images by dragging & dropping, selecting or pasting them.</span>
        </div>
        <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Submit new issue
        </button>
      </form>
      <Alert className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Note</AlertTitle>
        <AlertDescription>
          This is a basic implementation. You'll need to add Markdown parsing, 
          Cloudinary integration, and possibly more robust error handling.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default IssueCreator;