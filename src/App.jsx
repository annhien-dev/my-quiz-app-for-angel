// src/App.jsx
import React, { useState } from 'react';
import { quizData } from './questions';
import './App.css';

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [inputValue, setInputValue] = useState('');
  
  // State mới để lưu trữ thông báo
  const [feedback, setFeedback] = useState({ message: '', type: '' }); 
  // State mới để kiểm tra đã trả lời câu hỏi chưa
  const [isAnswered, setIsAnswered] = useState(false); 

  const handleAnswerSubmit = (submittedAnswer) => {
    if (isAnswered) return; // Nếu đã trả lời rồi thì không làm gì cả
    setIsAnswered(true); // Đánh dấu là đã trả lời

    const correctAnswer = quizData[currentQuestion].correctAnswer;
    
    // Kiểm tra câu trả lời và set thông báo
    if (submittedAnswer.trim().toLowerCase() === correctAnswer.toLowerCase()) {
      setScore(score + 1);
      setFeedback({ message: "Chúc mừng Tú Anh Angel!", type: 'correct' });
    } else {
      setFeedback({ message: "Sai rồi, cố gắng ở lần sau nhé!", type: 'incorrect' });
    }

    // Tạo độ trễ 2 giây trước khi chuyển câu hỏi
    setTimeout(() => {
      setInputValue('');
      setFeedback({ message: '', type: '' });

      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < quizData.length) {
        setCurrentQuestion(nextQuestion);
      } else {
        setShowScore(true);
      }

      setIsAnswered(false); // Cho phép trả lời ở câu hỏi tiếp theo
    }, 2000); // 2000 milliseconds = 2 giây
  };

  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
  };

  const currentQuestionData = quizData[currentQuestion];

  return (
    <div className="app">
      {showScore ? (
        <div className="score-section">
          <h2>Bé đã hoàn thành!</h2>
          <p>Điểm của bé là {score} trên {quizData.length}</p>
          <button onClick={handleRestartQuiz}>Chơi lại</button>
        </div>
      ) : (
        <>
          <div className="question-section">
            <div className="question-count">
              <span>Câu hỏi {currentQuestion + 1}</span>/{quizData.length}
            </div>
            <div className="question-text">{currentQuestionData.question}</div>
          </div>
          <div className="answer-section">
            {/* HIỂN THỊ THÔNG BÁO PHẢN HỒI */}
            {feedback.message && (
              <div className={`feedback ${feedback.type === 'correct' ? 'feedback-correct' : 'feedback-incorrect'}`}>
                {feedback.message}
              </div>
            )}

            {currentQuestionData.type === 'multiple-choice' ? (
              currentQuestionData.options.split(';').map((option, index) => (
                <button 
                  key={index} 
                  onClick={() => handleAnswerSubmit(option)}
                  disabled={isAnswered}
                >
                  {option}
                </button>
              ))
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); handleAnswerSubmit(inputValue); }}>
                <input
                  type="text"
                  className="text-input"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  disabled={isAnswered}
                  autoFocus
                />
                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={isAnswered}
                >
                  Trả lời
                </button>
              </form>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;