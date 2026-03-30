import { createContext, useContext, useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import * as firestoreService from '../services/firestore';
import { storage } from '../utils/storage';
import { seedFirestore, isDatabaseEmpty } from '../utils/seedFirestore';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [appData, setAppData] = useState({
    students: [],
    mentors: [],
    courses: [],
    chapters: [],
    topics: [],
    sessions: [],
    doubts: [],
    studyPlans: [],
    analytics: {}
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [currentRole, setCurrentRole] = useState('student');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Loading initial data from Firestore...');
      
      // Check if database is empty and seed if needed
      console.log('🔍 Checking if database needs seeding...');
      const isEmpty = await isDatabaseEmpty();
      
      if (isEmpty) {
        console.log('📦 Database is empty, seeding with initial data...');
        const seedResult = await seedFirestore();
        if (!seedResult.success) {
          throw new Error(`Seeding failed: ${seedResult.error}`);
        }
        console.log('✅ Database seeded successfully');
      } else {
        console.log('✅ Database already has data');
      }
      
      // Try to get current user and role from localStorage
      const savedUser = storage.get('currentUser');
      const savedRole = storage.get('currentRole');
      
      if (savedUser) {
        setCurrentUser(savedUser);
        console.log('👤 Restored user from localStorage:', savedUser.name || savedUser.id);
      }
      if (savedRole) {
        setCurrentRole(savedRole);
        console.log('🎭 Restored role from localStorage:', savedRole);
      }

      // Load all data from Firestore
      console.log('📥 Fetching data from Firestore...');
      const [usersSnap, coursesSnap, chaptersSnap, topicsSnap, sessionsSnap, doubtsSnap] = await Promise.all([
        getDocs(collection(db, 'users')),
        getDocs(collection(db, 'courses')),
        getDocs(collection(db, 'chapters')),
        getDocs(collection(db, 'topics')),
        getDocs(collection(db, 'sessions')),
        getDocs(collection(db, 'doubts'))
      ]);

      const students = [];
      const mentors = [];
      
      usersSnap.forEach(doc => {
        const data = { id: doc.id, ...doc.data() };
        if (data.role === 'student') students.push(data);
        if (data.role === 'mentor') mentors.push(data);
      });

      const courses = [];
      coursesSnap.forEach(doc => courses.push({ id: doc.id, ...doc.data() }));

      const chapters = [];
      chaptersSnap.forEach(doc => chapters.push({ id: doc.id, ...doc.data() }));

      const topics = [];
      topicsSnap.forEach(doc => topics.push({ id: doc.id, ...doc.data() }));

      const sessions = [];
      sessionsSnap.forEach(doc => sessions.push({ id: doc.id, ...doc.data() }));

      const doubts = [];
      doubtsSnap.forEach(doc => doubts.push({ id: doc.id, ...doc.data() }));

      console.log('📊 Data loaded:', {
        students: students.length,
        mentors: mentors.length,
        courses: courses.length,
        chapters: chapters.length,
        topics: topics.length,
        sessions: sessions.length,
        doubts: doubts.length
      });

      setAppData({
        students,
        mentors,
        courses,
        chapters,
        topics,
        sessions,
        doubts,
        studyPlans: [],
        analytics: {}
      });

      console.log('✅ Initial data loaded successfully');
      setLoading(false);
    } catch (err) {
      console.error('❌ Error loading data:', err);
      console.error('Error details:', {
        message: err.message,
        code: err.code,
        stack: err.stack
      });
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const refreshData = async () => {
    await loadInitialData();
  };

  const updateCurrentUser = async (user) => {
    setCurrentUser(user);
    storage.set('currentUser', user);
    
    // Only update Firestore if user has a valid ID and is not 'new'
    if (user && user.id && user.id !== 'new' && user.id !== 'admin') {
      try {
        await firestoreService.updateUser(user.id, user);
      } catch (error) {
        console.error('Error updating user in Firestore:', error);
      }
    }
  };

  const switchRole = (role) => {
    setCurrentRole(role);
    storage.set('currentRole', role);
  };

  const addStudent = async (student) => {
    const studentId = student.id && student.id !== 'new' 
      ? `student_${student.id}` 
      : `student_${Date.now()}`;
    
    const studentData = {
      ...student,
      role: 'student',
      onboarded: student.onboarded || false,
      assignedStudents: student.assignedStudents || [],
      completedTopics: student.completedTopics || [],
      xp: student.xp || 0,
      level_number: student.level_number || 1,
      streak: student.streak || 0
    };
    
    delete studentData.id; // Remove id from data
    
    const result = await firestoreService.createUser(studentId, studentData);
    
    if (result.success) {
      await refreshData();
      return { ...result, id: studentId };
    }
    
    return result;
  };

  const updateStudent = async (id, updates) => {
    const result = await firestoreService.updateUser(id, updates);
    
    if (result.success) {
      // Refresh data to get updated student
      await refreshData();
    }
    
    return result;
  };

  const addMentor = async (mentor) => {
    const mentorId = mentor.id && mentor.id !== 'new' 
      ? `mentor_${mentor.id}` 
      : `mentor_${Date.now()}`;
    
    const mentorData = {
      ...mentor,
      role: 'mentor',
      onboarded: mentor.onboarded || false,
      assignedStudents: mentor.assignedStudents || [],
      subjects: mentor.subjects || [],
      sessionsCompleted: mentor.sessionsCompleted || 0
    };
    
    delete mentorData.id; // Remove id from data
    
    const result = await firestoreService.createUser(mentorId, mentorData);
    
    if (result.success) {
      await refreshData();
      return { ...result, id: mentorId };
    }
    
    return result;
  };

  const updateMentor = async (id, updates) => {
    const result = await firestoreService.updateUser(id, updates);
    
    if (result.success) {
      // Refresh data to get updated mentor
      await refreshData();
    }
    
    return result;
  };

  const addCourse = async (course) => {
    const result = await firestoreService.createCourse(course);
    
    if (result.success) {
      await refreshData();
    }
    
    return result;
  };

  const addChapter = async (chapter) => {
    const result = await firestoreService.createChapter(chapter);
    
    if (result.success) {
      await refreshData();
    }
    
    return result;
  };

  const addTopic = async (topic) => {
    const result = await firestoreService.createTopic(topic);
    
    if (result.success) {
      await refreshData();
    }
    
    return result;
  };

  const addSession = async (session) => {
    const result = await firestoreService.createSession(session);
    
    if (result.success) {
      await refreshData();
    }
    
    return result;
  };

  const addDoubt = async (doubt) => {
    const result = await firestoreService.createDoubt(doubt);
    
    if (result.success) {
      await refreshData();
    }
    
    return result;
  };

  const updateDoubt = async (id, updates) => {
    const result = await firestoreService.updateDoubt(id, updates);
    
    if (result.success) {
      setAppData(prev => ({
        ...prev,
        doubts: prev.doubts.map(d => d.id === id ? { ...d, ...updates } : d)
      }));
    }
    
    return result;
  };

  const addStudyPlan = async (plan) => {
    const result = await firestoreService.createStudyPlan(plan.studentId, plan);
    
    if (result.success) {
      await refreshData();
    }
    
    return result;
  };

  const updateStudyPlan = async (studentId, updates) => {
    const result = await firestoreService.updateStudyPlan(studentId, updates);
    
    if (result.success) {
      await refreshData();
    }
    
    return result;
  };

  const value = {
    appData,
    currentUser,
    currentRole,
    loading,
    error,
    updateCurrentUser,
    switchRole,
    addStudent,
    updateStudent,
    addMentor,
    updateMentor,
    addCourse,
    addChapter,
    addTopic,
    addSession,
    addDoubt,
    updateDoubt,
    addStudyPlan,
    updateStudyPlan,
    refreshData
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-lg mb-2">Loading LearnSync...</div>
          <div className="text-gray-400 text-sm">Connecting to database</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-2">Error loading data</div>
          <div className="text-gray-600 text-sm mb-4">{error}</div>
          <button 
            onClick={loadInitialData}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
