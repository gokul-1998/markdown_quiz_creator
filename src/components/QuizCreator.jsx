import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const QuizCreator = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [hint, setHint] = useState('');
  const [explanation, setExplanation] = useState('');
  const [questionType, setQuestionType] = useState('fillup');
  const [cardScore, setCardScore] = useState(2);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const textAreaRefs = {
    question: useRef(null),
    answer: useRef(null),
    hint: useRef(null),
    explanation: useRef(null),
  };

  const adjustTextAreaHeight = (ref, content) => {
    if (ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  };

  useEffect(() => adjustTextAreaHeight(textAreaRefs.question, question), [question]);
  useEffect(() => adjustTextAreaHeight(textAreaRefs.answer, answer), [answer]);
  useEffect(() => adjustTextAreaHeight(textAreaRefs.hint, hint), [hint]);
  useEffect(() => adjustTextAreaHeight(textAreaRefs.explanation, explanation), [explanation]);

  const handleImagePaste = async (e, setState) => {
    const items = e.clipboardData.items;
    const item = items[0];

    if (item && item.type.indexOf('image') !== -1) {
      setIsUploading(true);
      const blob = item.getAsFile();

      const formData = new FormData();
      formData.append('file', blob);

      try {
        const response = await axios.post('http://localhost:8000/photo_upload/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const imageUrl = response.data.url;
        setState((prev) => `${prev}\n\n![Uploaded Image](${imageUrl})\n\n`);
        setIsUploading(false);
      } catch (error) {
        console.error('Error uploading image:', error);
        setErrorMessage('Failed to upload image.');
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const quizData = {
      front: question,
      back: answer,
      hint,
      explanation,
      card_score: cardScore,
      is_fill_up: questionType === 'fillup', // true for fill-up, false for flashcard
      tags: [], // Assuming tags are not included for now
    };

    try {
      const response = await axios.post('http://localhost:8000/cards/32', quizData);
      console.log('Submitted Quiz Data:', response.data);
    } catch (error) {
      console.error('Error submitting quiz data:', error);
      setErrorMessage('Failed to submit quiz data.');
    }
  };

  const renderTextarea = (label, value, setValue, ref) => (
    <div>
      <label className="font-bold">{label}:</label>
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onPaste={(e) => handleImagePaste(e, setValue)}
        placeholder={`Enter ${label.toLowerCase()}`}
        className="w-full p-2 border rounded resize-none overflow-hidden min-h-[100px]"
        disabled={isUploading} // Disable textarea during image upload
      />
      {isUploading && <p className="text-sm text-gray-600">Uploading...</p>}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderTextarea('Question', question, setQuestion, textAreaRefs.question)}
          {renderTextarea('Answer', answer, setAnswer, textAreaRefs.answer)}
          {renderTextarea('Hint', hint, setHint, textAreaRefs.hint)}
          {renderTextarea('Explanation', explanation, setExplanation, textAreaRefs.explanation)}

          <div className="flex items-center space-x-4">
            <label className="font-bold">Question Type:</label>
            <div className="flex items-center">
              <input
                type="radio"
                value="fillup"
                checked={questionType === 'fillup'}
                onChange={(e) => setQuestionType(e.target.value)}
                className="mr-2"
              />
              <label>Fill-up</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                value="flashcard"
                checked={questionType === 'flashcard'}
                onChange={(e) => setQuestionType(e.target.value)}
                className="mr-2"
              />
              <label>Flashcard</label>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <label className="font-bold">Card Score (1-5):</label>
            <input
              type="number"
              value={cardScore}
              min="1"
              max="5"
              onChange={(e) => setCardScore(Number(e.target.value))}
              className="w-16 p-2 border rounded"
            />
          </div>

          {errorMessage && <p className="text-red-600">{errorMessage}</p>}

          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            disabled={isUploading} // Disable button during image upload
          >
            Submit Question
          </button>
        </form>

        <div className="mt-6 md:mt-0">
          <h2 className="text-xl font-bold mb-2">Preview:</h2>

          <div className="space-y-4 text-left">
            <div>
              <h3 className="font-bold">Question Preview:</h3>
              <div className="border p-4 rounded bg-gray-100">
                <ReactMarkdown className="markdown" remarkPlugins={[remarkGfm]}>{question}</ReactMarkdown>
              </div>
            </div>

            <div>
              <h3 className="font-bold">Answer Preview:</h3>
              <div className="border p-4 rounded bg-gray-100">
                <ReactMarkdown className="markdown" remarkPlugins={[remarkGfm]}>{answer}</ReactMarkdown>
              </div>
            </div>

            <div>
              <h3 className="font-bold">Hint Preview:</h3>
              <div className="border p-4 rounded bg-gray-100">
                <ReactMarkdown className="markdown" remarkPlugins={[remarkGfm]}>{hint}</ReactMarkdown>
              </div>
            </div>

            <div>
              <h3 className="font-bold">Explanation Preview:</h3>
              <div className="border p-4 rounded bg-gray-100">
                <ReactMarkdown className="markdown" remarkPlugins={[remarkGfm]}>{explanation}</ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizCreator;
