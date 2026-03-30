import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { Brain, Plus, X } from 'lucide-react';
import { allocateMentor } from '../../utils/mentorAllocation';

const StudentOnboarding = ({ onComplete }) => {
  const { addStudent, appData, updateMentor } = useApp();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    class: '',
    subjects: [],
    skillAssessment: {},
    quizAnswers: {}
  });
  const [newSubject, setNewSubject] = useState('');

  // Get subjects based on class
  const getSubjectsByClass = (classValue) => {
    const classNum = parseInt(classValue);
    
    if (classNum >= 1 && classNum <= 5) {
      // Primary School (Classes 1-5)
      return {
        core: ['English', 'Mathematics', 'Environmental Studies (EVS)'],
        additional: ['Second Language', 'General Knowledge', 'Computer Basics', 'Moral Science', 'Art & Craft', 'Physical Education']
      };
    } else if (classNum >= 6 && classNum <= 8) {
      // Middle School (Classes 6-8)
      return {
        core: ['English', 'Mathematics', 'Science', 'Social Studies'],
        additional: ['Second Language', 'Third Language', 'Computer Science', 'General Knowledge', 'Art/Music/Dance', 'Physical Education']
      };
    } else if (classNum >= 9 && classNum <= 10) {
      // Secondary School (Classes 9-10)
      return {
        core: ['English', 'Mathematics', 'Science (Physics)', 'Science (Chemistry)', 'Science (Biology)', 'Social Science (History)', 'Social Science (Geography)', 'Social Science (Civics)', 'Social Science (Economics)'],
        additional: ['Second Language', 'Computer Science/IT', 'Physical Education', 'Art/Vocational']
      };
    } else if (classNum >= 11 && classNum <= 12) {
      // Higher Secondary (Classes 11-12)
      return {
        core: ['English'],
        additional: ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science', 'Accountancy', 'Business Studies', 'Economics', 'History', 'Political Science', 'Geography', 'Psychology', 'Sociology', 'Physical Education']
      };
    }
    
    return { core: [], additional: [] };
  };

  const availableSubjects = formData.class ? getSubjectsByClass(formData.class) : { core: [], additional: [] };

  // Dynamic quiz questions generator - 6 questions (2 easy, 2 medium, 2 hard)
  const generateQuizQuestions = (subject) => {
    return [
      // Easy questions (Q1-Q2)
      { 
        id: 1, 
        question: `What is your basic understanding of ${subject}?`, 
        options: ['Just starting', 'Know a little', 'Understand basics', 'Very comfortable'], 
        correct: 2, 
        level: 'easy',
        difficulty: 'Easy'
      },
      { 
        id: 2, 
        question: `Can you solve simple ${subject} problems?`, 
        options: ['No', 'With help', 'Yes, usually', 'Yes, easily'], 
        correct: 2, 
        level: 'easy',
        difficulty: 'Easy'
      },
      // Medium questions (Q3-Q4)
      { 
        id: 3, 
        question: `How well do you understand ${subject} concepts?`, 
        options: ['Not well', 'Somewhat', 'Well', 'Very well'], 
        correct: 2, 
        level: 'medium',
        difficulty: 'Medium'
      },
      { 
        id: 4, 
        question: `Can you apply ${subject} in different situations?`, 
        options: ['Rarely', 'Sometimes', 'Often', 'Always'], 
        correct: 2, 
        level: 'medium',
        difficulty: 'Medium'
      },
      // Hard questions (Q5-Q6)
      { 
        id: 5, 
        question: `Can you solve complex ${subject} problems independently?`, 
        options: ['No', 'With guidance', 'Yes, mostly', 'Yes, confidently'], 
        correct: 2, 
        level: 'hard',
        difficulty: 'Hard'
      },
      { 
        id: 6, 
        question: `Can you teach ${subject} concepts to others?`, 
        options: ['No', 'Basic concepts only', 'Most concepts', 'Yes, confidently'], 
        correct: 2, 
        level: 'hard',
        difficulty: 'Hard'
      }
    ];
  };

  const handleAddSubject = () => {
    if (newSubject.trim() && !formData.subjects.includes(newSubject.trim())) {
      setFormData(prev => ({
        ...prev,
        subjects: [...prev.subjects, newSubject.trim()],
        skillAssessment: {
          ...prev.skillAssessment,
          [newSubject.trim()]: {}
        }
      }));
      setNewSubject('');
    }
  };

  const handleRemoveSubject = (subject) => {
    setFormData(prev => {
      const newSkillAssessment = { ...prev.skillAssessment };
      delete newSkillAssessment[subject];
      
      return {
        ...prev,
        subjects: prev.subjects.filter(s => s !== subject),
        skillAssessment: newSkillAssessment
      };
    });
  };

  const handleSkillAssessment = (subject, topic, level) => {
    setFormData(prev => ({
      ...prev,
      skillAssessment: {
        ...prev.skillAssessment,
        [subject]: {
          ...prev.skillAssessment[subject],
          [topic]: level
        }
      }
    }));
  };

  const handleQuizAnswer = (subject, questionId, answerIndex) => {
    setFormData(prev => ({
      ...prev,
      quizAnswers: {
        ...prev.quizAnswers,
        [subject]: {
          ...prev.quizAnswers[subject],
          [questionId]: answerIndex
        }
      }
    }));
  };

  const calculateLevel = () => {
    let totalScore = 0;
    let totalQuestions = 0;

    formData.subjects.forEach(subject => {
      const questions = generateQuizQuestions(subject);
      const answers = formData.quizAnswers[subject] || {};
      
      questions.forEach(q => {
        if (answers[q.id] !== undefined) {
          totalQuestions++;
          if (answers[q.id] === q.correct) {
            totalScore++;
          }
        }
      });
    });

    // Evaluation Logic: Score ≤ 2 → Beginner, Score ≤ 4 → Intermediate, Score ≥ 5 → Advanced
    const avgScore = totalQuestions > 0 ? totalScore / formData.subjects.length : 0;
    
    if (avgScore <= 2) return 'beginner';
    if (avgScore <= 4) return 'intermediate';
    return 'advanced';
  };

  const handleSubmit = () => {
    const weakTopics = {};
    const strongTopics = {};

    Object.entries(formData.skillAssessment).forEach(([subject, topics]) => {
      weakTopics[subject] = [];
      strongTopics[subject] = [];
      
      // Store overall rating as a topic for compatibility
      Object.entries(topics).forEach(([, level]) => {
        if (level === 'weak') weakTopics[subject].push(subject.toLowerCase());
        if (level === 'strong') strongTopics[subject].push(subject.toLowerCase());
      });
    });

    const ageMode = formData.age <= 10 ? 'foundation' : formData.age <= 15 ? 'growth' : 'mastery';
    const detectedLevel = calculateLevel();

    // Allocate mentor based on student profile
    const allocatedMentor = allocateMentor({
      ...formData,
      age: formData.age,
      detectedLevel,
      subjects: formData.subjects
    }, appData.mentors);

    const newStudent = {
      ...formData,
      level: ageMode,
      detectedLevel,
      weakTopics,
      strongTopics,
      mentorId: allocatedMentor?.id || null,
      progress: 0,
      xp: 0,
      level_number: 1,
      streak: 0,
      attendance: 100,
      completedTopics: [],
      onboarded: true
    };

    const studentId = Date.now();
    const studentWithId = { ...newStudent, id: studentId };

    // Update mentor's assigned students
    if (allocatedMentor) {
      updateMentor(allocatedMentor.id, {
        assignedStudents: [...allocatedMentor.assignedStudents, studentId]
      });
    }

    addStudent(studentWithId);
    onComplete(studentWithId);
  };

  const canProceed = () => {
    if (step === 1) return formData.name && formData.age && formData.class;
    if (step === 2) return formData.subjects.length > 0;
    if (step === 3) {
      return formData.subjects.every(subject => 
        formData.skillAssessment[subject]?.['overall']
      );
    }
    if (step === 4) {
      return formData.subjects.every(subject => {
        const questions = generateQuizQuestions(subject);
        const answers = formData.quizAnswers[subject] || {};
        return questions.every(q => answers[q.id] !== undefined);
      });
    }
    return true;
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-semibold text-gray-900">Welcome to LearnSync!</h2>
            <span className="text-gray-500">Step {step} of 4</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Tell us about yourself</h3>
            <div>
              <label className="block text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your age"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Class</label>
                <input
                  type="text"
                  value={formData.class}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 7th"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Subject Selection Based on Class */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Select your subjects</h3>
            <p className="text-gray-600 text-sm">Based on Class {formData.class}</p>
            
            {/* Core Subjects */}
            {availableSubjects.core && availableSubjects.core.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Core Subjects</h4>
                <div className="grid grid-cols-2 gap-3">
                  {availableSubjects.core.map(subject => (
                    <button
                      key={subject}
                      onClick={() => {
                        setFormData(prev => {
                          const isSelected = prev.subjects.includes(subject);
                          const newSubjects = isSelected
                            ? prev.subjects.filter(s => s !== subject)
                            : [...prev.subjects, subject];
                          
                          const newSkillAssessment = { ...prev.skillAssessment };
                          if (isSelected) {
                            delete newSkillAssessment[subject];
                          } else {
                            newSkillAssessment[subject] = {};
                          }

                          return {
                            ...prev,
                            subjects: newSubjects,
                            skillAssessment: newSkillAssessment
                          };
                        });
                      }}
                      className={`p-3 rounded-xl border-2 transition-all text-left ${
                        formData.subjects.includes(subject)
                          ? 'border-blue-600 bg-blue-50 text-blue-900'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-medium">{subject}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Subjects */}
            {availableSubjects.additional && availableSubjects.additional.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Additional Subjects (Optional)</h4>
                <div className="grid grid-cols-2 gap-3">
                  {availableSubjects.additional.map(subject => (
                    <button
                      key={subject}
                      onClick={() => {
                        setFormData(prev => {
                          const isSelected = prev.subjects.includes(subject);
                          const newSubjects = isSelected
                            ? prev.subjects.filter(s => s !== subject)
                            : [...prev.subjects, subject];
                          
                          const newSkillAssessment = { ...prev.skillAssessment };
                          if (isSelected) {
                            delete newSkillAssessment[subject];
                          } else {
                            newSkillAssessment[subject] = {};
                          }

                          return {
                            ...prev,
                            subjects: newSubjects,
                            skillAssessment: newSkillAssessment
                          };
                        });
                      }}
                      className={`p-3 rounded-xl border-2 transition-all text-left ${
                        formData.subjects.includes(subject)
                          ? 'border-green-600 bg-green-50 text-green-900'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-medium text-sm">{subject}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Subject Input */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Add Other Subject</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSubject()}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type subject name..."
                />
                <Button onClick={handleAddSubject}>
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Selected Subjects */}
            {formData.subjects.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Selected Subjects ({formData.subjects.length})</h4>
                <div className="flex flex-wrap gap-2">
                  {formData.subjects.map((subject) => (
                    <div
                      key={subject}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg"
                    >
                      <span className="font-medium text-blue-900 text-sm">{subject}</span>
                      <button
                        onClick={() => handleRemoveSubject(subject)}
                        className="p-1 hover:bg-blue-100 rounded transition-colors"
                      >
                        <X className="w-4 h-4 text-blue-600" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Subject Rating */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Rate your understanding</h3>
              <p className="text-gray-600 text-sm">How comfortable are you with each subject?</p>
            </div>

            {formData.subjects.map((subject) => (
              <div key={subject} className="p-4 bg-gray-50 rounded-xl">
                <p className="font-semibold text-gray-900 mb-3">{subject}</p>
                <div className="flex gap-3">
                  {['weak', 'okay', 'strong'].map((level) => (
                    <button
                      key={level}
                      onClick={() => handleSkillAssessment(subject, 'overall', level)}
                      className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        formData.skillAssessment[subject]?.['overall'] === level
                          ? level === 'weak'
                            ? 'bg-red-500 text-white'
                            : level === 'okay'
                            ? 'bg-yellow-500 text-white'
                            : 'bg-green-500 text-white'
                          : 'bg-white border-2 border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">
                        {level === 'weak' ? '😕' : level === 'okay' ? '😐' : '😊'}
                      </div>
                      <div className="capitalize">{level}</div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 4: Dynamic Mini Quiz */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-6 h-6 text-purple-600" />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Quick Assessment</h3>
                <p className="text-gray-600 text-sm">Help us understand your current level</p>
              </div>
            </div>
            
            {formData.subjects.map((subject) => (
              <div key={subject} className="space-y-4">
                <h4 className="font-semibold text-gray-900 text-lg">{subject}</h4>
                {generateQuizQuestions(subject).map((q, index) => (
                  <div key={q.id} className="p-4 bg-gray-50 rounded-xl">
                    <p className="font-medium text-gray-900 mb-3">
                      {index + 1}. {q.question}
                    </p>
                    <div className="space-y-2">
                      {q.options.map((option, optIndex) => (
                        <label
                          key={optIndex}
                          className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                            formData.quizAnswers[subject]?.[q.id] === optIndex
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`${subject}-${q.id}`}
                            checked={formData.quizAnswers[subject]?.[q.id] === optIndex}
                            onChange={() => handleQuizAnswer(subject, q.id, optIndex)}
                            className="w-4 h-4"
                          />
                          <span className="text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between mt-6">
          {step > 1 && (
            <Button variant="secondary" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          {step < 4 ? (
            <Button 
              onClick={() => setStep(step + 1)} 
              className="ml-auto"
              disabled={!canProceed()}
            >
              Next
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              className="ml-auto"
              disabled={!canProceed()}
            >
              Complete Setup
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default StudentOnboarding;
