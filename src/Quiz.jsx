// src/Quiz.jsx (Phiên bản SỬA LỖI màn hình trắng và giữ lại âm thanh)
import React, { useState, useEffect, useRef } from 'react'; // THÊM LẠI: import useRef
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Confetti from 'react-confetti';

function Quiz({ questions, lessonTitle }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [userInputValue, setUserInputValue] = useState('');
  const [wasCorrect, setWasCorrect] = useState(null);

  // THAY ĐỔI 1: Khởi tạo ref với giá trị `null` ban đầu.
  const correctAudioRef = useRef(null);

  // THAY ĐỔI 2: Thêm một useEffect mới để khởi tạo đối tượng Audio một cách an toàn.
  // Mảng rỗng `[]` ở cuối đảm bảo effect này chỉ chạy MỘT LẦN DUY NHẤT khi component được tạo.
  useEffect(() => {
    correctAudioRef.current = new Audio('/sounds/correct-sound.mp3');
  }, []);

  // Hook để reset trạng thái khi chuyển câu hỏi (giữ nguyên)
  useEffect(() => {
    setIsAnswered(false);
    setShowHint(false);
    setSelectedOption('');
    setUserInputValue('');
    setWasCorrect(null);
  }, [currentQuestionIndex]);

  // Hook để phát âm thanh (thêm kiểm tra an toàn)
  useEffect(() => {
    // THAY ĐỔI 3: Thêm điều kiện `correctAudioRef.current` để đảm bảo đối tượng audio đã tồn tại trước khi play.
    if (wasCorrect === true && correctAudioRef.current) {
      correctAudioRef.current.currentTime = 0;
      correctAudioRef.current.play().catch(error => {
        console.log("Lỗi phát âm thanh:", error);
      });
    }
  }, [wasCorrect]);

  // ...Phần còn lại của component không thay đổi...

  if (!questions || questions.length === 0) {
    return <div className="quiz-container"><h2>Đang tải câu hỏi...</h2></div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  const goToNextQuestion = () => {
    const nextQuestion = currentQuestionIndex + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestionIndex(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowScore(false);
  };

  const handleOptionClick = (optionText) => {
    if (isAnswered) return;
    const isCorrect = optionText.toLowerCase() === currentQuestion.correctAnswer.toLowerCase();
    setIsAnswered(true);
    setSelectedOption(optionText);
    setWasCorrect(isCorrect);
    if (isCorrect) setScore(score + 1);
    setTimeout(goToNextQuestion, 4000);
  };

  const handleTextSubmit = (event) => {
    event.preventDefault();
    if (isAnswered || !userInputValue.trim()) return;
    const isCorrect = userInputValue.trim().toLowerCase() === currentQuestion.correctAnswer.toLowerCase();
    setIsAnswered(true);
    setWasCorrect(isCorrect);
    if (isCorrect) setScore(score + 1);
    setTimeout(goToNextQuestion, 4000);
  };

  if (showScore) {
    return (
      <div className="quiz-container score-section fade-in">
        <h2>Hoàn thành!</h2>
        <p>Bạn đã trả lời đúng {score} trên {questions.length} câu hỏi.</p>
        {/* THÊM DIV NÀY ĐỂ BỌC CÁC NÚT */}
        <div className="score-buttons">
          <button className="submit-button" onClick={restartQuiz}>Làm lại bài này</button>
          <button className="submit-button" onClick={() => window.location.reload()}>Chọn bài khác</button>
        </div>
      </div>
    );
  }

  const renderAnswerOptions = () => {
    if (currentQuestion.type === 'multiple-choice') {
      const optionsArray = currentQuestion.options.split(';');
      return optionsArray.map((option, index) => {
        let buttonClass = '';
        if (isAnswered) {
          if (option.toLowerCase() === currentQuestion.correctAnswer.toLowerCase()) {
            buttonClass = 'correct';
          } else if (option.toLowerCase() === selectedOption.toLowerCase()) {
            buttonClass = 'incorrect';
          }
        }
        return (
          <button key={index} className={buttonClass} onClick={() => handleOptionClick(option)} disabled={isAnswered}>
            {option}
          </button>
        );
      });
    }
    if (currentQuestion.type === 'fill-in-the-blank') {
      let feedbackClass = '';
      if (isAnswered) {
        feedbackClass = wasCorrect ? 'correct' : 'incorrect';
      }
      return (
        <form onSubmit={handleTextSubmit}>
          <input type="text" className={`text-input ${feedbackClass}`} value={userInputValue} onChange={(e) => setUserInputValue(e.target.value)} disabled={isAnswered} autoFocus />
          <button type="submit" className="submit-button" disabled={isAnswered}>Trả lời</button>
        </form>
      );
    }
    return <p>Lỗi: Không xác định được loại câu hỏi.</p>;
  };

  return (
    <div className="quiz-container">
      {wasCorrect && <Confetti recycle={false} numberOfPieces={300} />}
      <div className="progress-bar-container">
        <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
      </div>
      <div key={currentQuestionIndex} className="fade-in">
        <div className="question-section">
          <div className="question-count">Câu hỏi {currentQuestionIndex + 1}/{questions.length}</div>
          <h2 className="question-text">{currentQuestion.question}</h2>
        </div>
        <div className="hint-section">
          {!isAnswered && !showHint && currentQuestion.hint && (
            <button onClick={() => setShowHint(true)} className="hint-button">Xem Gợi ý</button>
          )}
          {showHint && <div className="hint-text">{currentQuestion.hint}</div>}
        </div>
        {isAnswered && (
          <div className='feedback-section'>
            {wasCorrect === true && (
              <div className="feedback-line correct">
                <FaCheckCircle className="feedback-icon" />
                <p className="feedback-message">Chúc Mừng!</p>
              </div>
            )}
            {wasCorrect === false && (
              <div className="feedback-line incorrect">
                <FaTimesCircle className="feedback-icon" />
                <p className="feedback-message">Sai rồi, cố gắng nhé!</p>
              </div>
            )}
            {currentQuestion.type === 'fill-in-the-blank' && !wasCorrect && (
              <p className='correct-answer-feedback'>Đáp án đúng là: <strong>{currentQuestion.correctAnswer}</strong></p>
            )}
            {currentQuestion.phonetic && <p className='phonetic-text'>{currentQuestion.phonetic}</p>}
          </div>
        )}
        <div className="answer-section">
          {renderAnswerOptions()}
        </div>
      </div>
    </div>
  );
}
export default Quiz;