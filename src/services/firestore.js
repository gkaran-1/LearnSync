import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * FIRESTORE SCHEMA DESIGN FOR LEARNSYNC
 * 
 * Collections:
 * 1. users - All user accounts (students, mentors, admins, NGOs)
 * 2. courses - Course catalog
 * 3. chapters - Course chapters
 * 4. topics - Learning topics within chapters
 * 5. studyPlans - Student study plans
 * 6. doubts - Student questions/doubts
 * 7. sessions - Mentor-student sessions
 * 8. quizResults - Quiz completion records
 * 9. achievements - Student achievements/badges
 * 10. notifications - User notifications
 */

// ==================== USERS ====================
export const createUser = async (userId, userData) => {
  try {
    const dataToSave = { ...userData };
    delete dataToSave.id; // Remove id from data, it's the document ID
    
    await setDoc(doc(db, 'users', userId), {
      ...dataToSave,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error creating user:', error);
    return { success: false, error: error.message };
  }
};

export const getUser = async (userId) => {
  try {
    const docSnap = await getDoc(doc(db, 'users', userId));
    if (docSnap.exists()) {
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    }
    return { success: false, error: 'User not found' };
  } catch (error) {
    console.error('Error getting user:', error);
    return { success: false, error: error.message };
  }
};

export const updateUser = async (userId, updates) => {
  try {
    const cleanUpdates = { ...updates };
    delete cleanUpdates.id; // Remove id from updates
    
    await updateDoc(doc(db, 'users', userId), {
      ...cleanUpdates,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating user:', error);
    return { success: false, error: error.message };
  }
};

export const getUsersByRole = async (role) => {
  try {
    const q = query(collection(db, 'users'), where('role', '==', role));
    const querySnapshot = await getDocs(q);
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: users };
  } catch (error) {
    console.error('Error getting users by role:', error);
    return { success: false, error };
  }
};

// ==================== COURSES ====================
export const createCourse = async (courseData) => {
  try {
    const docRef = await addDoc(collection(db, 'courses'), {
      ...courseData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating course:', error);
    return { success: false, error };
  }
};

export const getCourse = async (courseId) => {
  try {
    const docSnap = await getDoc(doc(db, 'courses', courseId));
    if (docSnap.exists()) {
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    }
    return { success: false, error: 'Course not found' };
  } catch (error) {
    console.error('Error getting course:', error);
    return { success: false, error };
  }
};

export const getCoursesByLevel = async (level) => {
  try {
    const q = query(collection(db, 'courses'), where('level', '==', level));
    const querySnapshot = await getDocs(q);
    const courses = [];
    querySnapshot.forEach((doc) => {
      courses.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: courses };
  } catch (error) {
    console.error('Error getting courses:', error);
    return { success: false, error };
  }
};

export const updateCourse = async (courseId, updates) => {
  try {
    await updateDoc(doc(db, 'courses', courseId), {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating course:', error);
    return { success: false, error };
  }
};

// ==================== CHAPTERS ====================
export const createChapter = async (chapterData) => {
  try {
    const docRef = await addDoc(collection(db, 'chapters'), {
      ...chapterData,
      createdAt: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating chapter:', error);
    return { success: false, error };
  }
};

export const getChaptersByCourse = async (courseId) => {
  try {
    const q = query(
      collection(db, 'chapters'), 
      where('courseId', '==', courseId),
      orderBy('order', 'asc')
    );
    const querySnapshot = await getDocs(q);
    const chapters = [];
    querySnapshot.forEach((doc) => {
      chapters.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: chapters };
  } catch (error) {
    console.error('Error getting chapters:', error);
    return { success: false, error };
  }
};

// ==================== TOPICS ====================
export const createTopic = async (topicData) => {
  try {
    const docRef = await addDoc(collection(db, 'topics'), {
      ...topicData,
      createdAt: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating topic:', error);
    return { success: false, error };
  }
};

export const getTopicsByChapter = async (chapterId) => {
  try {
    const q = query(
      collection(db, 'topics'), 
      where('chapterId', '==', chapterId),
      orderBy('order', 'asc')
    );
    const querySnapshot = await getDocs(q);
    const topics = [];
    querySnapshot.forEach((doc) => {
      topics.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: topics };
  } catch (error) {
    console.error('Error getting topics:', error);
    return { success: false, error };
  }
};

// ==================== STUDY PLANS ====================
export const createStudyPlan = async (studentId, planData) => {
  try {
    await setDoc(doc(db, 'studyPlans', studentId), {
      studentId,
      ...planData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error creating study plan:', error);
    return { success: false, error };
  }
};

export const getStudyPlan = async (studentId) => {
  try {
    const docSnap = await getDoc(doc(db, 'studyPlans', studentId));
    if (docSnap.exists()) {
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    }
    return { success: false, error: 'Study plan not found' };
  } catch (error) {
    console.error('Error getting study plan:', error);
    return { success: false, error };
  }
};

export const updateStudyPlan = async (studentId, updates) => {
  try {
    await updateDoc(doc(db, 'studyPlans', studentId), {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating study plan:', error);
    return { success: false, error };
  }
};

// ==================== DOUBTS ====================
export const createDoubt = async (doubtData) => {
  try {
    const docRef = await addDoc(collection(db, 'doubts'), {
      ...doubtData,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating doubt:', error);
    return { success: false, error };
  }
};

export const getDoubtsByStudent = async (studentId) => {
  try {
    const q = query(
      collection(db, 'doubts'), 
      where('studentId', '==', studentId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const doubts = [];
    querySnapshot.forEach((doc) => {
      doubts.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: doubts };
  } catch (error) {
    console.error('Error getting doubts:', error);
    return { success: false, error };
  }
};

export const getDoubtsByMentor = async (mentorId) => {
  try {
    const q = query(
      collection(db, 'doubts'), 
      where('mentorId', '==', mentorId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const doubts = [];
    querySnapshot.forEach((doc) => {
      doubts.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: doubts };
  } catch (error) {
    console.error('Error getting doubts:', error);
    return { success: false, error };
  }
};

export const updateDoubt = async (doubtId, updates) => {
  try {
    await updateDoc(doc(db, 'doubts', doubtId), {
      ...updates,
      updatedAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating doubt:', error);
    return { success: false, error };
  }
};

// ==================== SESSIONS ====================
export const createSession = async (sessionData) => {
  try {
    const docRef = await addDoc(collection(db, 'sessions'), {
      ...sessionData,
      createdAt: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating session:', error);
    return { success: false, error };
  }
};

export const getSessionsByStudent = async (studentId) => {
  try {
    const q = query(
      collection(db, 'sessions'), 
      where('studentId', '==', studentId),
      orderBy('scheduledAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const sessions = [];
    querySnapshot.forEach((doc) => {
      sessions.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: sessions };
  } catch (error) {
    console.error('Error getting sessions:', error);
    return { success: false, error };
  }
};

export const getSessionsByMentor = async (mentorId) => {
  try {
    const q = query(
      collection(db, 'sessions'), 
      where('mentorId', '==', mentorId),
      orderBy('scheduledAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const sessions = [];
    querySnapshot.forEach((doc) => {
      sessions.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: sessions };
  } catch (error) {
    console.error('Error getting sessions:', error);
    return { success: false, error };
  }
};

// ==================== QUIZ RESULTS ====================
export const saveQuizResult = async (resultData) => {
  try {
    const docRef = await addDoc(collection(db, 'quizResults'), {
      ...resultData,
      completedAt: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error saving quiz result:', error);
    return { success: false, error };
  }
};

export const getQuizResultsByStudent = async (studentId) => {
  try {
    const q = query(
      collection(db, 'quizResults'), 
      where('studentId', '==', studentId),
      orderBy('completedAt', 'desc'),
      limit(50)
    );
    const querySnapshot = await getDocs(q);
    const results = [];
    querySnapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: results };
  } catch (error) {
    console.error('Error getting quiz results:', error);
    return { success: false, error };
  }
};

// ==================== ACHIEVEMENTS ====================
export const unlockAchievement = async (studentId, achievementData) => {
  try {
    const docRef = await addDoc(collection(db, 'achievements'), {
      studentId,
      ...achievementData,
      unlockedAt: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error unlocking achievement:', error);
    return { success: false, error };
  }
};

export const getAchievementsByStudent = async (studentId) => {
  try {
    const q = query(
      collection(db, 'achievements'), 
      where('studentId', '==', studentId),
      orderBy('unlockedAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const achievements = [];
    querySnapshot.forEach((doc) => {
      achievements.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: achievements };
  } catch (error) {
    console.error('Error getting achievements:', error);
    return { success: false, error };
  }
};

// ==================== NOTIFICATIONS ====================
export const createNotification = async (notificationData) => {
  try {
    const docRef = await addDoc(collection(db, 'notifications'), {
      ...notificationData,
      read: false,
      createdAt: serverTimestamp()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error creating notification:', error);
    return { success: false, error };
  }
};

export const getNotificationsByUser = async (userId) => {
  try {
    const q = query(
      collection(db, 'notifications'), 
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    const querySnapshot = await getDocs(q);
    const notifications = [];
    querySnapshot.forEach((doc) => {
      notifications.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: notifications };
  } catch (error) {
    console.error('Error getting notifications:', error);
    return { success: false, error };
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    await updateDoc(doc(db, 'notifications', notificationId), {
      read: true,
      readAt: serverTimestamp()
    });
    return { success: true };
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return { success: false, error };
  }
};

// ==================== BATCH OPERATIONS ====================
export const batchUpdateStudentProgress = async (studentId, updates) => {
  try {
    const batch = writeBatch(db);
    
    // Update user document
    const userRef = doc(db, 'users', studentId);
    batch.update(userRef, {
      xp: updates.xp,
      level: updates.level,
      completedTopics: updates.completedTopics,
      updatedAt: serverTimestamp()
    });
    
    // Update study plan if needed
    if (updates.studyPlanUpdates) {
      const studyPlanRef = doc(db, 'studyPlans', studentId);
      batch.update(studyPlanRef, {
        ...updates.studyPlanUpdates,
        updatedAt: serverTimestamp()
      });
    }
    
    await batch.commit();
    return { success: true };
  } catch (error) {
    console.error('Error batch updating student progress:', error);
    return { success: false, error };
  }
};
