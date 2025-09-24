// src/App.jsx
import React, { useState } from 'react';
import { quizData } from './questions';
import './App.css';

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [inputValue, setInputValue] = useState('');
  
  // Cập nhật state để chứa cả phiên âm
  const [feedback, setFeedback] = useState({ message: '', type: '', phonetic: '' }); 
  const [isAnswered, setIsAnswered] = useState(false); 

  const handleAnswerSubmit = (submittedAnswer) => {
    if (isAnswered) return;
    setIsAnswered(true);

    const currentQuizItem = quizData[currentQuestion];
    const correctAnswer = currentQuizItem.correctAnswer;
    const phonetic = currentQuizItem.phonetic || ''; // Lấy phiên âm, nếu không có thì là chuỗi rỗng

    if (submittedAnswer.trim().toLowerCase() === correctAnswer.toLowerCase()) {
      setScore(score + 1);
      setFeedback({ message: "Chúc mừng Tú Anh Angel!", type: 'correct', phonetic: phonetic });
    } else {
      setFeedback({ message: "Sai rồi, cố gắng ở lần sau nhé!", type: 'incorrect', phonetic: phonetic });
    }

    setTimeout(() => {
      setInputValue('');
      setFeedback({ message: '', type: '', phonetic: '' });

      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < quizData.length) {
        setCurrentQuestion(nextQuestion);
      } else {
        setShowScore(true);
      }

      setIsAnswered(false);
    }, 2500); // Tăng thời gian lên 2.5s để bé kịp đọc
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
            {/* CẬP NHẬT PHẦN HIỂN THỊ THÔNG BÁO */}
            {feedback.message && (
              <div className={`feedback ${feedback.type === 'correct' ? 'feedback-correct' : 'feedback-incorrect'}`}>
                {feedback.message}
                {feedback.phonetic && (
                  <span className="phonetic-text">
                    {currentQuestionData.correctAnswer}: {feedback.phonetic}
                  </span>
                )}
              </div>
            )}

            {currentQuestionData.type === 'multiple-choice' ? (
              (currentQuestionData.options || '').split(';').map((option, index) => (
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