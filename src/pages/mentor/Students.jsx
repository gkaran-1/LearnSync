import { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import ProgressBar from '../../components/ProgressBar';
import { User, TrendingUp, Target, Calendar, FileText, AlertCircle, AlertTriangle, Send, CheckCircle, Plus, X, Trash2, ScanLine, Upload, Loader, Camera } from 'lucide-react';
import { scanTestPaper } from '../../utils/gemini';

const ISSUE_TYPES = [
  'Learning Difficulty',
  'Attendance Concern',
  'Behavioral Issue',
  'Personal Issues',
  'Health Concern',
  'Financial Constraint',
  'Other',
];

const SUBJECTS_LIST = ['Math', 'Science', 'English', 'History', 'Geography', 'Computer Science', 'Hindi', 'Physics', 'Chemistry', 'Biology'];
const LEVELS = ['foundation', 'growth', 'mastery'];

const emptyStudent = {
  name: '', age: '', class: '', level: 'foundation',
  subjects: [], progress: '', attendance: '', xp: '',
  weakTopics: '', strongTopics: '',
};

const emptyScore = { subject: '', topic: '', score: '', total: '', date: '' };

const Students = () => {
  const { appData, currentUser, updateStudent, addNotification, addStudent } = useApp();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [notes, setNotes] = useState('');

  // Report to NGO state
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportStudent, setReportStudent] = useState(null);
  const [reportIssue, setReportIssue] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportPriority, setReportPriority] = useState('high');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // Add student state
  const [showAddModal, setShowAddModal] = useState(false);
  const [addStep, setAddStep] = useState(1); // 1 = details, 2 = test scores
  const [newStudent, setNewStudent] = useState(emptyStudent);
  const [testScores, setTestScores] = useState([{ ...emptyScore }]);
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [addDone, setAddDone] = useState(false);

  // OCR state
  const [showOcrModal, setShowOcrModal] = useState(false);
  const [ocrStudent, setOcrStudent] = useState(null);
  const [ocrImage, setOcrImage] = useState(null);       // { base64, mimeType, previewUrl }
  const [ocrScanning, setOcrScanning] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);     // extracted data
  const [ocrError, setOcrError] = useState('');
  const [ocrSaved, setOcrSaved] = useState(false);
  const fileInputRef = useRef();

  const mentor = appData.mentors.find(m => m.id === currentUser?.id) || appData.mentors[0];
  const assignedStudents = appData.students.filter(s => {
    if (mentor.assignedStudents && mentor.assignedStudents.includes(s.id)) return true;
    if (s.mentorId === mentor.id) return true;
    return false;
  });

  // Also load manually added students from localStorage
  const manualStudents = JSON.parse(localStorage.getItem('learnsync-manual-students') || '[]')
    .filter(s => s.mentorId === mentor.id);
  const allStudents = [...assignedStudents, ...manualStudents];

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setNotes(student.mentorNotes || '');
    setShowDetailModal(true);
  };

  const handleSaveNotes = () => {
    if (selectedStudent) {
      updateStudent(selectedStudent.id, { mentorNotes: notes });
      setShowDetailModal(false);
    }
  };

  // Report to NGO handlers
  const handleOpenReport = (student) => {
    setReportStudent(student);
    setReportIssue('');
    setReportDescription('');
    setReportPriority('high');
    setReportSubmitted(false);
    setShowReportModal(true);
  };

  const handleSubmitReport = () => {
    if (!reportIssue || !reportDescription.trim()) return;

    addNotification({
      type: 'student-flag',
      priority: reportPriority,
      flaggedBy: mentor.name,
      student: reportStudent.name,
      studentId: reportStudent.id,
      issue: reportIssue,
      description: reportDescription.trim(),
    });

    setReportSubmitted(true);
  };

  const getQuizHistory = (studentId) => {
    return appData.sessions
      .filter(s => s.studentId === studentId && s.score)
      .map(s => ({
        date: s.date,
        topic: s.topic,
        score: s.score,
        total: 5
      }));
  };

  // ── Add Student handlers ──────────────────────────────────────────────
  const handleOpenAdd = () => {
    setNewStudent(emptyStudent);
    setTestScores([{ ...emptyScore }]);
    setAddStep(1);
    setAddDone(false);
    setShowAddModal(true);
  };

  const toggleSubject = (sub) => {
    setNewStudent(prev => ({
      ...prev,
      subjects: prev.subjects.includes(sub)
        ? prev.subjects.filter(s => s !== sub)
        : [...prev.subjects, sub]
    }));
  };

  const addScoreRow = () => setTestScores(prev => [...prev, { ...emptyScore }]);
  const removeScoreRow = (i) => setTestScores(prev => prev.filter((_, idx) => idx !== i));
  const updateScore = (i, field, val) => setTestScores(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s));

  const handleAddStudent = () => {    if (!newStudent.name.trim() || !newStudent.class.trim()) return;
    setAddSubmitting(true);

    const weakTopicsObj = {};
    if (newStudent.weakTopics.trim()) {
      weakTopicsObj['General'] = newStudent.weakTopics.split(',').map(t => t.trim()).filter(Boolean);
    }
    const strongTopicsObj = {};
    if (newStudent.strongTopics.trim()) {
      strongTopicsObj['General'] = newStudent.strongTopics.split(',').map(t => t.trim()).filter(Boolean);
    }

    const validScores = testScores.filter(s => s.subject && s.topic && s.score && s.total);

    const newId = `student_manual_${Date.now()}`;
    const studentData = {
      id: newId,
      name: newStudent.name.trim(),
      age: parseInt(newStudent.age) || 0,
      class: newStudent.class.trim(),
      level: newStudent.level,
      subjects: newStudent.subjects.length > 0 ? newStudent.subjects : ['General'],
      progress: parseInt(newStudent.progress) || 0,
      attendance: parseInt(newStudent.attendance) || 0,
      xp: parseInt(newStudent.xp) || 0,
      weakTopics: weakTopicsObj,
      strongTopics: strongTopicsObj,
      testScores: validScores,
      mentorId: mentor.id,
      onboarded: true,
      level_number: 1,
      streak: 0,
      completedTopics: [],
      role: 'student',
    };

    // Save to localStorage
    const saved = JSON.parse(localStorage.getItem('learnsync-manual-students') || '[]');
    saved.push(studentData);
    localStorage.setItem('learnsync-manual-students', JSON.stringify(saved));

    // Add to mentor's assignedStudents in localStorage
    const mentorStudents = JSON.parse(localStorage.getItem(`learnsync-mentor-students-${mentor.id}`) || '[]');
    mentorStudents.push(newId);
    localStorage.setItem(`learnsync-mentor-students-${mentor.id}`, JSON.stringify(mentorStudents));

    setAddSubmitting(false);
    setAddDone(true);
  };

  // ── OCR handlers ──────────────────────────────────────────────────────
  const handleOpenOcr = (student) => {
    setOcrStudent(student);
    setOcrImage(null);
    setOcrResult(null);
    setOcrError('');
    setOcrSaved(false);
    setShowOcrModal(true);
  };

  const handleImageSelect = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      const base64 = dataUrl.split(',')[1];
      const mimeType = file.type || 'image/jpeg';
      setOcrImage({ base64, mimeType, previewUrl: dataUrl });
      setOcrResult(null);
      setOcrError('');
    };
    reader.readAsDataURL(file);
  };

  const handleScan = async () => {
    if (!ocrImage) return;
    setOcrScanning(true);
    setOcrError('');
    const result = await scanTestPaper(ocrImage.base64, ocrImage.mimeType);
    setOcrScanning(false);
    if (result.success && result.data) {
      setOcrResult(result.data);
    } else {
      setOcrError(result.error || 'Could not extract data from the image. Try a clearer photo.');
    }
  };

  const handleSaveOcrScore = () => {
    if (!ocrResult || !ocrStudent) return;
    const score = {
      subject: ocrResult.subject || '',
      topic: ocrResult.topic || '',
      score: ocrResult.score ?? '',
      total: ocrResult.total ?? '',
      date: ocrResult.date || new Date().toISOString().split('T')[0],
      grade: ocrResult.grade || '',
      remarks: ocrResult.remarks || '',
      scannedAt: new Date().toISOString(),
    };
    const key = `learnsync-test-scores-${ocrStudent.id}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push(score);
    localStorage.setItem(key, JSON.stringify(existing));
    setOcrSaved(true);
  };

  return (
    <div className="space-y-4 md:space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">My Students</h1>
          <p className="text-sm md:text-base text-gray-500 mt-1">Manage and track student progress · {allStudents.length} students</p>
        </div>
        <button onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4" /> Add Student
        </button>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {allStudents.map((student) => (
          <Card key={student.id} className="hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3 md:gap-4 mb-4">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm md:text-base">{student.name}</h3>
                <p className="text-xs md:text-sm text-gray-500">Age {student.age} • Class {student.class}</p>
              </div>
            </div>

            {/* Report Button - Full Width on Mobile */}
            <button
              onClick={(e) => { e.stopPropagation(); handleOpenReport(student); }}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 mb-4 text-xs md:text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:border-red-300 transition-colors"
              title="Report this student's issue to NGO Administrator"
            >
              <AlertTriangle className="w-3.5 h-3.5 md:w-4 md:h-4" />
              Report to NGO
            </button>

            <div className="space-y-3 mb-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs md:text-sm text-gray-600">Progress</span>
                  <span className="text-xs md:text-sm font-semibold text-gray-900">{student.progress}%</span>
                </div>
                <ProgressBar progress={student.progress} />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs md:text-sm text-gray-600">Attendance</span>
                  <span className="text-xs md:text-sm font-semibold text-gray-900">{student.attendance}%</span>
                </div>
                <ProgressBar progress={student.attendance} />
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-xs md:text-sm text-gray-600">XP</span>
              <span className="text-base md:text-lg font-bold text-blue-600">{student.xp}</span>
            </div>

            {/* Status Badge */}
            <div className="mb-4">
              <span className={`px-2.5 md:px-3 py-1 rounded-full text-xs md:text-sm ${
                student.progress >= 70 && student.attendance >= 80 ? 'bg-green-100 text-green-600' :
                student.progress >= 40 || student.attendance >= 60 ? 'bg-yellow-100 text-yellow-600' :
                'bg-red-100 text-red-600'
              }`}>
                {student.progress >= 70 && student.attendance >= 80 ? 'On Track' :
                 student.progress >= 40 || student.attendance >= 60 ? 'Needs Support' :
                 'At Risk'}
              </span>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => handleViewDetails(student)} className="flex-1">
                View Details
              </Button>
              <button onClick={() => handleOpenOcr(student)}
                title="Scan offline test paper"
                className="flex items-center gap-1.5 px-3 py-2 bg-purple-600 text-white text-xs font-semibold rounded-xl hover:bg-purple-700 transition-colors">
                <ScanLine className="w-4 h-4" /> Scan
              </button>
            </div>
          </Card>
        ))}
      </div>

      {allStudents.length === 0 && (
        <Card>
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No students assigned yet</p>
          </div>
        </Card>
      )}

      {/* Student Detail Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title={selectedStudent?.name || 'Student Details'}
      >
        {selectedStudent && (
          <div className="space-y-4 md:space-y-6 max-h-[70vh] overflow-y-auto px-1">
            {/* Basic Info */}
            <div className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-base md:text-lg font-semibold text-gray-900">{selectedStudent.name}</h3>
                <p className="text-sm md:text-base text-gray-600">Age {selectedStudent.age} • Class {selectedStudent.class}</p>
                <p className="text-xs md:text-sm text-gray-600">Level: <span className="capitalize">{selectedStudent.level}</span></p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 md:gap-3">
              <div className="p-2 md:p-3 bg-blue-50 rounded-lg text-center">
                <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-blue-600 mx-auto mb-1" />
                <p className="text-lg md:text-2xl font-bold text-gray-900">{selectedStudent.progress}%</p>
                <p className="text-[10px] md:text-xs text-gray-600">Progress</p>
              </div>
              <div className="p-2 md:p-3 bg-green-50 rounded-lg text-center">
                <Calendar className="w-4 h-4 md:w-5 md:h-5 text-green-600 mx-auto mb-1" />
                <p className="text-lg md:text-2xl font-bold text-gray-900">{selectedStudent.attendance}%</p>
                <p className="text-[10px] md:text-xs text-gray-600">Attendance</p>
              </div>
              <div className="p-2 md:p-3 bg-purple-50 rounded-lg text-center">
                <Target className="w-4 h-4 md:w-5 md:h-5 text-purple-600 mx-auto mb-1" />
                <p className="text-lg md:text-2xl font-bold text-gray-900">{selectedStudent.xp}</p>
                <p className="text-[10px] md:text-xs text-gray-600">XP</p>
              </div>
            </div>

            {/* Weak Topics */}
            <div>
              <h4 className="text-sm md:text-base font-semibold text-gray-900 mb-2 md:mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-red-600" />
                Weak Topics
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(selectedStudent.weakTopics).map(([subject, topics]) => (
                  topics.map((topic) => (
                    <div key={`${subject}-${topic}`} className="p-2 bg-red-50 border border-red-200 rounded-lg">
                      <p className="font-medium text-red-600 capitalize text-xs md:text-sm">{topic}</p>
                      <p className="text-[10px] md:text-xs text-red-500">{subject}</p>
                    </div>
                  ))
                ))}
              </div>
            </div>

            {/* Quiz Scores */}
            <div>
              <h4 className="text-sm md:text-base font-semibold text-gray-900 mb-2 md:mb-3">Recent Quiz Scores</h4>
              <div className="space-y-2">
                {getQuizHistory(selectedStudent.id).slice(0, 5).map((quiz, index) => (
                  <div key={index} className="flex items-center justify-between p-2 md:p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="text-sm md:text-base font-medium text-gray-900 truncate">{quiz.topic}</p>
                      <p className="text-[10px] md:text-xs text-gray-500">{quiz.date}</p>
                    </div>
                    <span className={`text-sm md:text-base font-semibold flex-shrink-0 ${
                      quiz.score / quiz.total >= 0.8 ? 'text-green-600' :
                      quiz.score / quiz.total >= 0.6 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {quiz.score}/{quiz.total}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes Section */}
            <div>
              <h4 className="text-sm md:text-base font-semibold text-gray-900 mb-2 md:mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 md:w-5 md:h-5 text-gray-600" />
                Mentor Notes
              </h4>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 md:h-32 text-sm md:text-base"
                placeholder="Add notes about this student's progress, concerns, or observations..."
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={handleSaveNotes} className="flex-1">
                Save Notes
              </Button>
              <Button
                variant="danger"
                onClick={() => { setShowDetailModal(false); handleOpenReport(selectedStudent); }}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                Report to NGO
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* ── Report to NGO Modal ──────────────────────────────────────────── */}
      <Modal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        title={reportSubmitted ? 'Report Submitted' : `Report ${reportStudent?.name || 'Student'} to NGO`}
      >
        {reportSubmitted ? (
          /* Success state */
          <div className="text-center py-4 md:py-6 space-y-3 md:space-y-4 px-2">
            <div className="inline-flex p-3 md:p-4 bg-green-100 rounded-full">
              <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-green-600" />
            </div>
            <h3 className="text-base md:text-lg font-semibold text-gray-900">Report Sent Successfully</h3>
            <p className="text-xs md:text-sm text-gray-600 max-w-sm mx-auto">
              Your report about <strong>{reportStudent?.name}</strong> has been sent to the NGO Administrator.
              They will review it and take appropriate action.
            </p>
            <div className="p-3 bg-gray-50 rounded-xl text-left">
              <p className="text-xs text-gray-500 mb-1">Issue reported</p>
              <p className="text-sm font-medium text-gray-900">{reportIssue}</p>
              <p className="text-xs text-gray-500 mt-2 mb-1">Priority</p>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                reportPriority === 'high' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
              }`}>{reportPriority}</span>
            </div>
            <Button onClick={() => setShowReportModal(false)} className="w-full mt-4">
              Done
            </Button>
          </div>
        ) : (
          /* Report form */
          <div className="space-y-4 md:space-y-5 max-h-[70vh] overflow-y-auto px-1">
            {/* Student info banner */}
            {reportStudent && (
              <div className="flex items-center gap-2 md:gap-3 p-2.5 md:p-3 bg-blue-50 border border-blue-100 rounded-xl">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 md:w-5 md:h-5 text-blue-700" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm md:text-base font-semibold text-gray-900 truncate">{reportStudent.name}</p>
                  <p className="text-[10px] md:text-xs text-gray-500">Age {reportStudent.age} • Class {reportStudent.class} • {reportStudent.level} level</p>
                </div>
              </div>
            )}

            {/* Issue type */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Issue Type *</label>
              <div className="grid grid-cols-2 gap-2">
                {ISSUE_TYPES.map(issue => (
                  <button
                    key={issue}
                    onClick={() => setReportIssue(issue)}
                    className={`px-2.5 py-1.5 md:px-3 md:py-2 text-xs md:text-sm rounded-lg border transition-all text-left ${
                      reportIssue === issue
                        ? 'border-red-400 bg-red-50 text-red-800 font-medium'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {issue}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Priority</label>
              <div className="flex gap-2 md:gap-3">
                <button
                  onClick={() => setReportPriority('high')}
                  className={`flex-1 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm rounded-lg border transition-all ${
                    reportPriority === 'high'
                      ? 'border-red-400 bg-red-50 text-red-800 font-medium'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  🔴 High
                </button>
                <button
                  onClick={() => setReportPriority('medium')}
                  className={`flex-1 px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm rounded-lg border transition-all ${
                    reportPriority === 'medium'
                      ? 'border-yellow-400 bg-yellow-50 text-yellow-800 font-medium'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  🟡 Medium
                </button>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Describe the Issue *</label>
              <textarea
                value={reportDescription}
                onChange={(e) => setReportDescription(e.target.value)}
                className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 h-24 md:h-32 text-xs md:text-sm"
                placeholder="Explain the problem in detail. What have you tried? Why does this need NGO intervention? ..."
              />
              <p className="text-[10px] md:text-xs text-gray-400 mt-1">{reportDescription.length} characters</p>
            </div>

            {/* Info box */}
            <div className="p-2.5 md:p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-[10px] md:text-xs text-yellow-800">
                <strong>Note:</strong> This report will be sent to the NGO Administrator as a high-priority notification.
                They will review it and may contact you for further details.
              </p>
            </div>

            {/* Submit */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="danger"
                onClick={handleSubmitReport}
                disabled={!reportIssue || !reportDescription.trim()}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit Report
              </Button>
              <Button variant="secondary" onClick={() => setShowReportModal(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>
      {/* ── OCR Scan Modal ─────────────────────────────────────────────── */}
      <Modal
        isOpen={showOcrModal}
        onClose={() => setShowOcrModal(false)}
        title={`Scan Test Paper — ${ocrStudent?.name || ''}`}
      >
        <div className="space-y-5 max-h-[75vh] overflow-y-auto px-1">
          {ocrSaved ? (
            <div className="text-center py-6 space-y-4">
              <div className="inline-flex p-4 bg-green-100 rounded-full">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Score Saved</h3>
              <p className="text-sm text-gray-500">
                {ocrResult?.subject} — {ocrResult?.score}/{ocrResult?.total} has been recorded for {ocrStudent?.name}.
              </p>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => { setOcrImage(null); setOcrResult(null); setOcrSaved(false); }} className="flex-1">
                  Scan Another
                </Button>
                <Button onClick={() => setShowOcrModal(false)} className="flex-1">Done</Button>
              </div>
            </div>
          ) : (
            <>
              {/* Upload area */}
              <div>
                <p className="text-xs text-gray-500 mb-3">Take a photo or upload a scan of the student's answer sheet. Gemini AI will extract the score automatically.</p>
                <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden"
                  onChange={e => handleImageSelect(e.target.files[0])} />
                {!ocrImage ? (
                  <div
                    onClick={() => fileInputRef.current.click()}
                    className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-600">Click to upload or take a photo</p>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG, HEIC supported</p>
                  </div>
                ) : (
                  <div className="relative">
                    <img src={ocrImage.previewUrl} alt="Scanned paper" className="w-full rounded-xl border border-gray-200 max-h-64 object-contain bg-gray-50" />
                    <button onClick={() => { setOcrImage(null); setOcrResult(null); setOcrError(''); }}
                      className="absolute top-2 right-2 p-1.5 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-red-50 hover:border-red-300 transition-colors">
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                )}
              </div>

              {/* Scan button */}
              {ocrImage && !ocrResult && (
                <button onClick={handleScan} disabled={ocrScanning}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-purple-600 text-white text-sm font-semibold rounded-xl hover:bg-purple-700 disabled:opacity-60 transition-colors">
                  {ocrScanning
                    ? <><Loader className="w-4 h-4 animate-spin" /> Analysing paper...</>
                    : <><ScanLine className="w-4 h-4" /> Extract Score with AI</>}
                </button>
              )}

              {/* Error */}
              {ocrError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">{ocrError}</div>
              )}

              {/* Extracted result — editable */}
              {ocrResult && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <p className="text-sm font-semibold text-gray-800">Extracted — review and confirm</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Subject', key: 'subject', type: 'text' },
                      { label: 'Topic / Chapter', key: 'topic', type: 'text' },
                      { label: 'Score (marks obtained)', key: 'score', type: 'number' },
                      { label: 'Out of (max marks)', key: 'total', type: 'number' },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
                        <input type={f.type} value={ocrResult[f.key] ?? ''}
                          onChange={e => setOcrResult(r => ({ ...r, [f.key]: f.type === 'number' ? Number(e.target.value) : e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                      </div>
                    ))}
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
                      <input type="date" value={ocrResult.date || ''}
                        onChange={e => setOcrResult(r => ({ ...r, date: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    </div>
                    {ocrResult.remarks && (
                      <div className="col-span-2">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Teacher Remarks</label>
                        <textarea value={ocrResult.remarks}
                          onChange={e => setOcrResult(r => ({ ...r, remarks: e.target.value }))}
                          rows={2} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none" />
                      </div>
                    )}
                  </div>

                  {/* Score preview */}
                  {ocrResult.score != null && ocrResult.total != null && ocrResult.total > 0 && (
                    <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between">
                      <span className="text-sm text-gray-600">Score</span>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-gray-900">{ocrResult.score}/{ocrResult.total}</span>
                        <span className={`text-sm font-semibold px-2 py-0.5 rounded-full ${
                          (ocrResult.score / ocrResult.total) >= 0.75 ? 'bg-green-100 text-green-700' :
                          (ocrResult.score / ocrResult.total) >= 0.5 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-600'
                        }`}>
                          {Math.round((ocrResult.score / ocrResult.total) * 100)}%
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => { setOcrResult(null); setOcrError(''); }} className="flex-1">
                      Rescan
                    </Button>
                    <Button onClick={handleSaveOcrScore}
                      disabled={!ocrResult.subject || ocrResult.score == null || ocrResult.total == null}
                      className="flex-1">
                      Save Score
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </Modal>

      {/* ── Add Student Modal ──────────────────────────────────────────── */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title={addDone ? 'Student Added' : addStep === 1 ? 'Add Student — Details' : 'Add Student — Test Scores'}
      >
        {addDone ? (
          <div className="text-center py-6 space-y-4">
            <div className="inline-flex p-4 bg-green-100 rounded-full">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{newStudent.name} added successfully</h3>
            <p className="text-sm text-gray-500">The student has been added to your roster and their test scores have been recorded.</p>
            <Button onClick={() => setShowAddModal(false)} className="w-full">Done</Button>
          </div>
        ) : (
          <div className="space-y-5 max-h-[70vh] overflow-y-auto px-1">

            {/* Step indicator */}
            <div className="flex items-center gap-2">
              {[1, 2].map(s => (
                <div key={s} className={`flex-1 h-1.5 rounded-full ${addStep >= s ? 'bg-blue-600' : 'bg-gray-200'}`} />
              ))}
              <span className="text-xs text-gray-400 ml-1">Step {addStep}/2</span>
            </div>

            {addStep === 1 && (
              <>
                {/* Name + Age */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
                    <input type="text" placeholder="e.g. Riya Sharma" value={newStudent.name}
                      onChange={e => setNewStudent(p => ({ ...p, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Age</label>
                    <input type="number" min={4} max={20} placeholder="e.g. 12" value={newStudent.age}
                      onChange={e => setNewStudent(p => ({ ...p, age: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>

                {/* Class + Level */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Class *</label>
                    <input type="text" placeholder="e.g. 7th" value={newStudent.class}
                      onChange={e => setNewStudent(p => ({ ...p, class: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Level</label>
                    <select value={newStudent.level} onChange={e => setNewStudent(p => ({ ...p, level: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white capitalize">
                      {LEVELS.map(l => <option key={l} value={l} className="capitalize">{l}</option>)}
                    </select>
                  </div>
                </div>

                {/* Subjects */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">Subjects</label>
                  <div className="flex flex-wrap gap-2">
                    {SUBJECTS_LIST.map(sub => (
                      <button key={sub} onClick={() => toggleSubject(sub)}
                        className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${newStudent.subjects.includes(sub) ? 'bg-blue-600 text-white border-blue-600' : 'border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Progress / Attendance / XP */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Progress %', key: 'progress', placeholder: '0–100' },
                    { label: 'Attendance %', key: 'attendance', placeholder: '0–100' },
                    { label: 'XP', key: 'xp', placeholder: 'e.g. 250' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-xs font-medium text-gray-700 mb-1">{f.label}</label>
                      <input type="number" min={0} placeholder={f.placeholder} value={newStudent[f.key]}
                        onChange={e => setNewStudent(p => ({ ...p, [f.key]: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  ))}
                </div>

                {/* Weak / Strong Topics */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Weak Topics</label>
                    <input type="text" placeholder="fractions, algebra (comma separated)" value={newStudent.weakTopics}
                      onChange={e => setNewStudent(p => ({ ...p, weakTopics: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Strong Topics</label>
                    <input type="text" placeholder="grammar, addition (comma separated)" value={newStudent.strongTopics}
                      onChange={e => setNewStudent(p => ({ ...p, strongTopics: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <Button variant="secondary" onClick={() => setShowAddModal(false)} className="flex-1">Cancel</Button>
                  <Button disabled={!newStudent.name.trim() || !newStudent.class.trim()} onClick={() => setAddStep(2)} className="flex-1">
                    Next: Test Scores →
                  </Button>
                </div>
              </>
            )}

            {addStep === 2 && (
              <>
                <p className="text-xs text-gray-500">Enter previous offline test results for this student. Leave blank rows to skip.</p>

                <div className="space-y-3">
                  {testScores.map((row, i) => (
                    <div key={i} className="p-3 bg-gray-50 border border-gray-100 rounded-xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-600">Test {i + 1}</span>
                        {testScores.length > 1 && (
                          <button onClick={() => removeScoreRow(i)} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input type="text" placeholder="Subject (e.g. Math)" value={row.subject}
                          onChange={e => updateScore(i, 'subject', e.target.value)}
                          className="px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <input type="text" placeholder="Topic (e.g. Fractions)" value={row.topic}
                          onChange={e => updateScore(i, 'topic', e.target.value)}
                          className="px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <input type="number" placeholder="Score (e.g. 18)" value={row.score}
                          onChange={e => updateScore(i, 'score', e.target.value)}
                          className="px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <input type="number" placeholder="Out of (e.g. 25)" value={row.total}
                          onChange={e => updateScore(i, 'total', e.target.value)}
                          className="px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <input type="date" value={row.date}
                          onChange={e => updateScore(i, 'date', e.target.value)}
                          className="col-span-2 px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                  ))}
                </div>

                <button onClick={addScoreRow}
                  className="w-full py-2 border-2 border-dashed border-gray-300 text-gray-500 text-sm rounded-xl hover:border-blue-400 hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
                  <Plus size={14} /> Add Another Test
                </button>

                <div className="flex gap-2 pt-1">
                  <Button variant="secondary" onClick={() => setAddStep(1)} className="flex-1">← Back</Button>
                  <Button onClick={handleAddStudent} disabled={addSubmitting} className="flex-1 flex items-center justify-center gap-2">
                    {addSubmitting ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Saving...</> : 'Add Student'}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Students;
