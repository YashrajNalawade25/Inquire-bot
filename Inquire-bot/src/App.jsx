import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; // Import the enhanced CSS

const App = () => {
  const [pdfs, setPdfs] = useState(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleFileChange = (e) => {
    setPdfs(e.target.files);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    for (let i = 0; i < pdfs.length; i++) {
      formData.append('pdfs', pdfs[i]);
    }

    try {
      await axios.post('/process-pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('PDF processed successfully');
    } catch (error) {
      console.error('Error processing PDFs:', error);
    }
  };

  const handleQuestionSubmit = async () => {
    try {
      const res = await axios.post('/ask-question', {
        question,
        chatHistory
      });

      // Update the chat history
      const newChat = [...chatHistory, { role: 'user', content: question }, { role: 'bot', content: res.data.answer }];
      setChatHistory(newChat);
      setAnswer(res.data.answer);
    } catch (error) {
      console.error('Error asking question:', error);
    }
  };

  return (
    <div className="container">
      <h1>Chat with PDFs</h1>

      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={handleUpload}>Process PDFs</button>

      <input
        type="text"
        placeholder="Ask a question about your documents"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button onClick={handleQuestionSubmit}>Ask Question</button>

      <div>
        <h2>Answer:</h2>
        <p>{answer}</p>
      </div>

      <div className="chat-history">
        <h2>Chat History:</h2>
        {chatHistory.map((chat, index) => (
          <div className="chat-message" key={index}>
            <span className={chat.role === 'user' ? 'user' : 'bot'}>
              {chat.role === 'user' ? 'You' : 'Bot'}:
            </span>
            <p>{chat.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
