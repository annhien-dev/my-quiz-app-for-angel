// src/App.jsx (Phiên bản đã sửa)
import React, { useState, useEffect } from 'react';
import Quiz from './Quiz';
import './App.css';

function App() {
  const [structure, setStructure] = useState([]);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedTopics, setExpandedTopics] = useState({});
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    fetch('/data/structure.json')
      .then(res => res.json())
      .then(data => {
        setStructure(data);
        if (data && data.length > 0) {
          setExpandedTopics({ [data[0].id]: true });
        }
      })
      .catch(error => console.error("Lỗi khi tải file structure.json:", error));
  }, []);

  const handleSelectLesson = (lesson) => {
    if (activeLesson?.id === lesson.id) return;
    setIsLoading(true);
    setActiveLesson(lesson);
    setQuizQuestions([]); 
    fetch(lesson.path)
      .then(res => res.json())
      .then(data => {
        setQuizQuestions(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error(`Lỗi khi tải file ${lesson.path}:`, error);
        setIsLoading(false);
      });
  };
  
  const toggleTopic = (topicId) => {
    setExpandedTopics(prev => ({
      ...prev,
      [topicId]: !prev[topicId]
    }));
  };

  return (
    <div className={`app-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      
      {/* ===== NÚT TOGGLE LUÔN HIỂN THỊ (ĐÃ DI CHUYỂN RA NGOÀI) ===== */}
      <button 
        className="floating-toggle-btn" 
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      >
        <span>&#9776;</span>
      </button>

      {/* ===== SIDEBAR MENU ===== */}
      <aside className="sidebar">
        <div className="sidebar-header">
          {/* Nút hamburger đã được chuyển ra ngoài */}
          <h3 className="sidebar-title">Các chủ đề</h3>
        </div>
        <nav className="sidebar-nav">
          {structure.map(topic => (
            <div key={topic.id} className="topic-group">
              <button className="topic-title" onClick={() => toggleTopic(topic.id)}>
                <span className="topic-text">{topic.icon} {topic.title}</span>
                <span className={`arrow ${expandedTopics[topic.id] ? 'expanded' : ''}`}>›</span>
              </button>
              {expandedTopics[topic.id] && (
                <ul className="lesson-list">
                  {topic.lessons.map(lesson => (
                    <li 
                      key={lesson.id} 
                      className={`lesson-item ${lesson.id === activeLesson?.id ? 'active' : ''}`}
                      onClick={() => handleSelectLesson(lesson)}
                    >
                      <span>{lesson.title}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="main-content">
        <div className="content-area">
          {isLoading ? (
            <div className="loading-spinner"></div>
          ) : activeLesson ? (
            <Quiz questions={quizQuestions} lessonTitle={activeLesson.title} />
          ) : (
            <div className="welcome-screen">
              <h2>Chào Mừng đến với Lớp Học Bất Ổn</h2>
              <p>Hãy chọn một bài học từ menu bên trái để bắt đầu! ✨</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;