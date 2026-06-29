import React, { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const CreateNotice = ({ onNoticeCreated }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title || !content) {
      return toast.error('Please fill out all fields');
    }

    setLoading(true);
    try {
      // Send the new notice to your backend
      const response = await api.post('/notices', { title, content });
      
      toast.success('Notice published successfully!');
      
      // Clear the form
      setTitle('');
      setContent('');
      
      // Instantly update the dashboard feed!
      if (onNoticeCreated) {
        onNoticeCreated(response.data);
      }
    } catch (error) {
      console.error('Error creating notice:', error);
      toast.error(error.response?.data?.message || 'Failed to publish notice');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md border border-gray-200 mb-8">
      <h3 className="text-xl font-bold mb-4">Post a New Notice</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Notice Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            placeholder="E.g., Campus Library Closed Tomorrow"
            required
          />
        </div>
        
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Message Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded h-24 focus:outline-none focus:border-blue-500 resize-none"
            placeholder="Provide the details here..."
            required
          ></textarea>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
          }`}
        >
          {loading ? 'Posting...' : 'Publish Notice'}
        </button>
      </form>
    </div>
  );
};

export default CreateNotice;