import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import ChatbotPanel from '../../components/ChatbotPanel';
import { BookOpen, ChevronRight, ChevronLeft, CheckCircle, Circle, Play, Lock, Sparkles, MessageCircle, Clock, Award, ArrowLeft } from 'lucide-react';
import { courseData } from '../../data/courseData';

const Courses = () => {
  const { appData, currentUser, updateStudent } = useApp();
  const [view, setView] = useState('courses'); // courses | lessons | subtopics | content
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState(null);
  const [quizMode, setQuizMode] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatbotContext, setChatbotContext] = useState(null);
  const [completedSubtopics, setCompletedSubtopics] = useState(() => {
    const saved = localStorage.getItem('learnsync-completed-subtopics');
    return saved ? JSON.parse(saved) : [];
  });

  const student = appData.students.find(s => s.id === currentUser?.id) || appData.students[0];
  const level = student?.level || 'foundation';
  const courses = courseData[level] || courseData.foundation;

  const markComplete = (subtopicId) => {
    if (!completedSubtopics.includes(subtopicId)) {
      const updated = [...completedSubtopics, subtopicId];
      setCompletedSubtopics(updated);
      localStorage.setItem('learnsync-completed-subtopics', JSON.stringify(updated));
    }
  };

  const handleQuizCompletion = (quizResult) => {
    if (quizResult?.topic) {
      markComplete(`quiz-${selectedLesson?.id}`);
    }
  };

  const openCourse = (course) => { setSelectedCourse(course); setView('lessons'); };
  const openLesson = (lesson) => { setSelectedLesson(lesson); setView('subtopics'); setQuizMode(false); setQuizSubmitted(false); setQuizAnswers({}); };
  const openSubtopic = (subtopic) => { setSelectedSubtopic(subtopic); setView('content'); };

  const goBack = () => {
    if (view === 'content') setView('subtopics');
    else if (view === 'subtopics') { setView('lessons'); setQuizMode(false); }
    else if (view === 'lessons') { setView('courses'); setSelectedCourse(null); }
  };

  const startQuiz = () => { setQuizMode(true); setQuizAnswers({}); setQuizSubmitted(false); };

  const submitQuiz = () => {
    setQuizSubmitted(true);
    markComplete(`quiz-${selectedLesson.id}`);
  };

  const getQuizScore = () => {
    if (!selectedLesson?.quiz) return { correct: 0, total: 0 };
    const qs = selectedLesson.quiz.questions;
    const correct = qs.filter((q, i) => quizAnswers[i] === q.ans).length;
    return { correct, total: qs.length, percent: Math.round((correct / qs.length) * 100) };
  };

  const getCourseProgress = (course) => {
    const total = course.lessons.reduce((sum, l) => sum + l.subtopics.length + 1, 0); // +1 for quiz
    const done = course.lessons.reduce((sum, l) => {
      const subtopicsDone = l.subtopics.filter(s => completedSubtopics.includes(s.id)).length;
      const quizDone = completedSubtopics.includes(`quiz-${l.id}`) ? 1 : 0;
      return sum + subtopicsDone + quizDone;
    }, 0);
    return total > 0 ? Math.round((done / total) * 100) : 0;
  };

  // ─── COURSE LIST VIEW ───
  if (view === 'courses') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
          <p className="text-gray-500 mt-1">
            {level === 'foundation' ? 'Foundation Level (Class 1-5)' : level === 'growth' ? 'Growth Level (Class 6-8)' : 'Mastery Level (Class 9-12)'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {courses.map(course => {
            const progress = getCourseProgress(course);
            const totalLessons = course.lessons.length;
            const totalSubtopics = course.lessons.reduce((s, l) => s + l.subtopics.length, 0);
            return (
              <div key={course.id} onClick={() => openCourse(course)}
                className="bg-white rounded-2xl border-2 border-gray-100 hover:border-blue-200 shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden group"
              >
                <div className={`bg-gradient-to-r ${course.color} p-5 text-white`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{course.icon}</span>
                      <div>
                        <h3 className="text-xl font-bold">{course.name}</h3>
                        <p className="text-white/80 text-sm">{course.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 opacity-70 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span>{totalLessons} Lessons • {totalSubtopics} Topics</span>
                    <span className="font-bold text-gray-900">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div className={`bg-gradient-to-r ${course.color} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${progress}%` }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    );
  }

  // ─── LESSONS VIEW ───
  if (view === 'lessons') {
    const progress = getCourseProgress(selectedCourse);
    return (
      <div className="space-y-6">
        <button onClick={goBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors font-medium">
          <ArrowLeft className="w-5 h-5" /> Back to Courses
        </button>

        <div className={`bg-gradient-to-r ${selectedCourse.color} rounded-2xl p-6 text-white`}>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{selectedCourse.icon}</span>
            <div>
              <h1 className="text-2xl font-bold">{selectedCourse.name}</h1>
              <p className="text-white/80">{selectedCourse.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-white/20 rounded-full h-3">
              <div className="bg-white h-3 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <span className="font-bold text-lg">{progress}%</span>
          </div>
        </div>

        <div className="space-y-4">
          {selectedCourse.lessons.map((lesson, idx) => {
            const doneSubs = lesson.subtopics.filter(s => completedSubtopics.includes(s.id)).length;
            const quizDone = completedSubtopics.includes(`quiz-${lesson.id}`);
            const totalItems = lesson.subtopics.length + 1;
            const doneItems = doneSubs + (quizDone ? 1 : 0);
            const lessonProgress = Math.round((doneItems / totalItems) * 100);

            return (
              <div key={lesson.id} onClick={() => openLesson(lesson)}
                className="bg-white rounded-xl border-2 border-gray-100 hover:border-blue-200 p-5 cursor-pointer hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg ${lessonProgress === 100 ? 'bg-green-500' : `bg-gradient-to-br ${selectedCourse.color}`}`}>
                    {lessonProgress === 100 ? <CheckCircle className="w-6 h-6" /> : idx + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{lesson.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                      <span>{lesson.subtopics.length} topics</span>
                      <span>•</span>
                      <span>1 quiz</span>
                      <span>•</span>
                      <span>{doneSubs + (quizDone ? 1 : 0)}/{totalItems} done</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                      <div className={`h-1.5 rounded-full transition-all ${lessonProgress === 100 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${lessonProgress}%` }} />
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    );
  }

  // ─── SUBTOPICS + QUIZ VIEW ───
  if (view === 'subtopics') {
    return (
      <div className="space-y-6">
        <button onClick={goBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors font-medium">
          <ArrowLeft className="w-5 h-5" /> Back to {selectedCourse.name}
        </button>

        <div className="bg-white rounded-2xl border-2 border-gray-100 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">{selectedLesson.title}</h2>
          <p className="text-gray-500 text-sm">{selectedLesson.subtopics.length} topics + 1 quiz</p>
        </div>

        {/* Subtopics list */}
        <div className="space-y-3">
          {selectedLesson.subtopics.map((subtopic, idx) => {
            const isDone = completedSubtopics.includes(subtopic.id);
            return (
              <div key={subtopic.id} onClick={() => openSubtopic(subtopic)}
                className={`bg-white rounded-xl border-2 p-4 cursor-pointer hover:shadow-md transition-all flex items-center gap-4 ${isDone ? 'border-green-200 bg-green-50/50' : 'border-gray-100 hover:border-blue-200'}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isDone ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {isDone ? <CheckCircle className="w-5 h-5" /> : <span className="font-bold text-sm">{idx + 1}</span>}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{subtopic.title}</h4>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400">
                    <Clock className="w-3 h-3" /> {subtopic.duration}
                  </div>
                </div>
                {isDone ? (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold">Done</span>
                ) : (
                  <Play className="w-5 h-5 text-blue-500" />
                )}
              </div>
            );
          })}

          {/* Quiz Card */}
          {!quizMode ? (
            <div onClick={startQuiz}
              className={`bg-white rounded-xl border-2 p-4 cursor-pointer hover:shadow-md transition-all flex items-center gap-4 ${completedSubtopics.includes(`quiz-${selectedLesson.id}`) ? 'border-green-200 bg-green-50/50' : 'border-purple-200 hover:border-purple-400 bg-purple-50/30'}`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${completedSubtopics.includes(`quiz-${selectedLesson.id}`) ? 'bg-green-500 text-white' : 'bg-purple-500 text-white'}`}>
                <Award className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">Lesson Quiz</h4>
                <p className="text-xs text-gray-400">{selectedLesson.quiz.questions.length} questions • Test your understanding</p>
              </div>
              {completedSubtopics.includes(`quiz-${selectedLesson.id}`) ? (
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-semibold">Passed ✓</span>
              ) : (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-semibold">Take Quiz</span>
              )}
            </div>
          ) : (
            <Card className="border-2 border-purple-200 bg-purple-50/30">
              <div className="flex items-center gap-3 mb-5">
                <Award className="w-6 h-6 text-purple-600" />
                <h3 className="text-lg font-bold text-gray-900">Lesson Quiz: {selectedLesson.title}</h3>
              </div>
              <div className="space-y-5">
                {selectedLesson.quiz.questions.map((q, qIdx) => (
                  <div key={qIdx} className="bg-white rounded-xl p-4 border border-gray-100">
                    <p className="font-semibold text-gray-900 mb-3">{qIdx + 1}. {q.q}</p>
                    <div className="space-y-2">
                      {q.opts.map((opt, oIdx) => {
                        let optClass = 'border-gray-200 hover:border-blue-300';
                        if (quizSubmitted) {
                          if (oIdx === q.ans) optClass = 'border-green-500 bg-green-50';
                          else if (quizAnswers[qIdx] === oIdx) optClass = 'border-red-500 bg-red-50';
                        } else if (quizAnswers[qIdx] === oIdx) {
                          optClass = 'border-blue-500 bg-blue-50';
                        }
                        return (
                          <label key={oIdx} className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${optClass}`}>
                            <input type="radio" name={`q-${qIdx}`} disabled={quizSubmitted} checked={quizAnswers[qIdx] === oIdx}
                              onChange={() => setQuizAnswers(prev => ({ ...prev, [qIdx]: oIdx }))} className="w-4 h-4" />
                            <span className="text-gray-700">{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {!quizSubmitted ? (
                <Button onClick={submitQuiz} disabled={Object.keys(quizAnswers).length < selectedLesson.quiz.questions.length} className="w-full mt-5">
                  Submit Quiz
                </Button>
              ) : (
                <div className={`mt-5 p-4 rounded-xl border-2 text-center ${getQuizScore().percent >= 50 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <p className="text-2xl font-bold">{getQuizScore().percent >= 50 ? '🎉' : '📚'}</p>
                  <p className="font-bold text-lg text-gray-900 mt-1">Score: {getQuizScore().correct}/{getQuizScore().total} ({getQuizScore().percent}%)</p>
                  <p className="text-sm text-gray-500 mt-1">{getQuizScore().percent >= 50 ? 'Great work! You passed!' : 'Review the topics and try again.'}</p>
                  <button onClick={() => { setQuizMode(false); setQuizSubmitted(false); setQuizAnswers({}); }} className="mt-3 text-sm text-blue-600 hover:underline font-medium">Close Quiz</button>
                </div>
              )}
            </Card>
          )}
        </div>

      </div>
    );
  }

  // ─── CONTENT VIEW ───
  if (view === 'content') {
    const isDone = completedSubtopics.includes(selectedSubtopic.id);
    return (
      <div className="space-y-6">
        <button onClick={goBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors font-medium">
          <ArrowLeft className="w-5 h-5" /> Back to {selectedLesson.title}
        </button>

        <Card className="border-2 border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-semibold">{selectedCourse.name}</span>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-gray-500">{selectedLesson.title}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" /> {selectedSubtopic.duration}
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-6">{selectedSubtopic.title}</h1>

          <div className="prose max-w-none">
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100 mb-6">
              <p className="text-gray-800 text-lg leading-relaxed">{selectedSubtopic.content}</p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            {!isDone && (
              <Button onClick={() => markComplete(selectedSubtopic.id)} className="flex-1 flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" /> Mark as Complete
              </Button>
            )}
            <Button variant="secondary" onClick={() => {
              window.dispatchEvent(new CustomEvent('open-ai-drawer', { detail: { title: selectedSubtopic.title, content: selectedSubtopic.content } }));
            }} className="flex-1 flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" /> Ask AI About This
            </Button>
          </div>

          {isDone && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-xl text-center">
              <p className="text-green-700 font-semibold">✅ You've completed this topic!</p>
            </div>
          )}
        </Card>

      </div>
    );
  }

  return null;
};

export default Courses;
