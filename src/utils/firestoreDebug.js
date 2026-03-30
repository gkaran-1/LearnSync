import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Debug utility to check Firestore connection and data
 * Use in browser console: window.checkFirestore()
 */
export const checkFirestoreConnection = async () => {
  try {
    console.log('🔍 Checking Firestore connection...');
    
    const collections = ['users', 'courses', 'chapters', 'topics', 'sessions', 'doubts'];
    const results = {};
    
    for (const collectionName of collections) {
      const snapshot = await getDocs(collection(db, collectionName));
      results[collectionName] = snapshot.size;
      console.log(`✅ ${collectionName}: ${snapshot.size} documents`);
    }
    
    console.log('📊 Summary:', results);
    console.log('✅ Firestore connection successful!');
    
    return results;
  } catch (error) {
    console.error('❌ Firestore connection failed:', error);
    console.error('Check your Firebase configuration in .env file');
    return { error: error.message };
  }
};

/**
 * Clear all data from Firestore (use with caution!)
 */
export const clearAllData = async () => {
  const confirmed = window.confirm(
    '⚠️ WARNING: This will delete ALL data from Firestore. Are you sure?'
  );
  
  if (!confirmed) {
    console.log('❌ Operation cancelled');
    return;
  }
  
  try {
    console.log('🗑️ Clearing all Firestore data...');
    
    const collections = ['users', 'courses', 'chapters', 'topics', 'sessions', 'doubts', 'studyPlans', 'quizResults', 'achievements', 'notifications'];
    
    for (const collectionName of collections) {
      const snapshot = await getDocs(collection(db, collectionName));
      console.log(`Deleting ${snapshot.size} documents from ${collectionName}...`);
      
      const deletePromises = [];
      snapshot.forEach((doc) => {
        deletePromises.push(doc.ref.delete());
      });
      
      await Promise.all(deletePromises);
    }
    
    console.log('✅ All data cleared! Refresh the page to re-seed.');
  } catch (error) {
    console.error('❌ Error clearing data:', error);
  }
};

/**
 * Export data from Firestore to JSON
 */
export const exportFirestoreData = async () => {
  try {
    console.log('📦 Exporting Firestore data...');
    
    const collections = ['users', 'courses', 'chapters', 'topics', 'sessions', 'doubts'];
    const exportData = {};
    
    for (const collectionName of collections) {
      const snapshot = await getDocs(collection(db, collectionName));
      exportData[collectionName] = [];
      
      snapshot.forEach((doc) => {
        exportData[collectionName].push({
          id: doc.id,
          ...doc.data()
        });
      });
    }
    
    console.log('✅ Export complete:', exportData);
    
    // Download as JSON file
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `firestore-export-${Date.now()}.json`;
    link.click();
    
    return exportData;
  } catch (error) {
    console.error('❌ Error exporting data:', error);
    return { error: error.message };
  }
};

// Make functions available in browser console for debugging
if (typeof window !== 'undefined') {
  window.checkFirestore = checkFirestoreConnection;
  window.exportFirestoreData = exportFirestoreData;
  window.clearFirestoreData = clearAllData;
  
  console.log('🔧 Firestore debug utilities loaded:');
  console.log('  - window.checkFirestore() - Check connection and document counts');
  console.log('  - window.exportFirestoreData() - Export all data to JSON file');
  console.log('  - window.clearFirestoreData() - Clear all data (use with caution!)');
}
