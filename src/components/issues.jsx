import React, { useState } from 'react';
import axios from 'axios';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bold, Italic, List, ListOrdered, Code, Link, Undo, Redo, Image as ImageIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Component() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [activeTab, setActiveTab] = useState('write');

  // to read from .env


  // Replace with your Cloudinary info
  const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dghtwpecg/image/upload";
  const UPLOAD_PRESET = "ml_default";

  const handleImagePaste = async (e) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        const formData = new FormData();
        formData.append('file', blob);
        formData.append('upload_preset', UPLOAD_PRESET);

        try {
          const response = await axios.post(CLOUDINARY_URL, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          const imageUrl = response.data.secure_url;
          setDescription((prev) => prev + `\n![Pasted Image](${imageUrl})\n`);
        } catch (error) {
          console.error('Upload failed:', error);
        }
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-[#0d1117] text-white">
      <div className="flex items-center space-x-4 mb-4">
        <Avatar className="w-10 h-10">
          <AvatarImage src="/placeholder-avatar.jpg" alt="@user" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <h1 className="text-xl font-semibold">Add a title</h1>
      </div>
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full bg-[#161b22] border-[#30363d] mb-4"
        placeholder="Title"
      />
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-[#161b22] border-b border-[#30363d]">
          <TabsTrigger value="write" className="data-[state=active]:bg-[#0d1117]">Write</TabsTrigger>
          <TabsTrigger value="preview" className="data-[state=active]:bg-[#0d1117]">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="write" className="mt-0">
          <div className="bg-[#161b22] border border-[#30363d] rounded-md">
            <div className="flex items-center space-x-2 p-2 border-b border-[#30363d]">
              {[Bold, Italic, List, ListOrdered, Code, Link, ImageIcon, Undo, Redo].map((Icon, index) => (
                <Button key={index} variant="ghost" size="icon" className="h-8 w-8 text-[#c9d1d9]">
                  <Icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onPaste={handleImagePaste}
              className="min-h-[200px] bg-[#0d1117] border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Add your description here..."
            />
          </div>
        </TabsContent>
        <TabsContent value="preview" className="mt-0">
          <div className="bg-[#0d1117] border border-[#30363d] rounded-md p-4 min-h-[200px]">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {description}
            </ReactMarkdown>
          </div>
        </TabsContent>
      </Tabs>
      <div className="flex items-center mt-2 text-sm text-[#8b949e]">
        <span className="flex items-center mr-4">
          <Code className="h-4 w-4 mr-1" />
          Markdown is supported
        </span>
        <span className="flex items-center">
          <ImageIcon className="h-4 w-4 mr-1" />
          Paste, drop, or click to add files
        </span>
      </div>
    </div>
  );
}
