// src/App.jsx
import React, { useState } from 'react';
import { quizData } from './questions';
import './App.css';

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [inputValue, setInputValue] = useState('');
  
  const [feedback, setFeedback] = useState({ message: '', type: '', phonetic: '' }); 
  const [isAnswered, setIsAnswered] = useState(false); 

  // PHẦN THÊM MỚI 1: Thêm state để quản lý việc hiển thị gợi ý
  const [showHint, setShowHint] = useState(false);

  const handleAnswerSubmit = (submittedAnswer) => {
    if (isAnswered) return;
    setIsAnswered(true);

    const currentQuizItem = quizData[currentQuestion];
    const correctAnswer = currentQuizItem.correctAnswer;
    const phonetic = currentQuizItem.phonetic || ''; 

    if (submittedAnswer.trim().toLowerCase() === correctAnswer.toLowerCase()) {
      setScore(score + 1);
      setFeedback({ message: "Chúc mừng!", type: 'correct', phonetic: phonetic });
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

      // PHẦN THÊM MỚI 2: Reset lại gợi ý khi sang câu mới
      setShowHint(false); 
      setIsAnswered(false);
    }, 5000); 
  };

  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
  };

  // PHẦN THÊM MỚI 3: Hàm để bật gợi ý
  const handleShowHint = () => {
    setShowHint(true);
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

            {/* PHẦN THÊM MỚI 4: Hiển thị nút Gợi ý và nội dung gợi ý */}
            <div className="hint-section">
              {currentQuestionData.hint && !showHint && (
                <button onClick={handleShowHint} className="hint-button">
                  Xem Gợi ý
                </button>
              )}
              {showHint && (
                <p className="hint-text">Gợi ý: {currentQuestionData.hint}</p>
              )}
            </div>
          </div>
          
          <div className="answer-section">
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