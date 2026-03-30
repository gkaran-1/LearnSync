import { useApp } from '../../context/AppContext';
import Card from '../../components/Card';
import { Users, BookOpen, TrendingUp, AlertCircle } from 'lucide-react';

const MentorDashboard = () => {
  const { appData, currentUser } = useApp();
  
  const mentor = appData.mentors.find(m => m.id === currentUser?.id) || appData.mentors[0];
  
  // Safety check for mentor data
  if (!mentor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-500">Loading mentor data...</p>
        </div>
      </div>
    );
  }
  
  const assignedStudents = appData.students.filter(s => 
    mentor.assignedStudents && mentor.assignedStudents.includes(s.id)
  );
  
  const pendingDoubts = appData.doubts.filter(d => 
    d.status === 'open' && 
    mentor.subjects && mentor.subjects.includes(d.subject)
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900">Welcome, {mentor.name}!</h1>
        <p className="text-gray-500 mt-1">Mentor Dashboard</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-xl">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Students</p>
              <p className="text-2xl font-semibold text-gray-900">{assignedStudents.length}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-50 rounded-xl">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Sessions</p>
              <p className="text-2xl font-semibold text-gray-900">{mentor.sessionsCompleted}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 rounded-xl">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Avg Improvement</p>
              <p className="text-2xl font-semibold text-gray-900">{mentor.avgImprovement}%</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-50 rounded-xl">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Pending Doubts</p>
              <p className="text-2xl font-semibold text-gray-900">{pendingDoubts.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Assigned Students */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Assigned Students</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-700 font-medium">Name</th>
                <th className="text-left py-3 px-4 text-gray-700 font-medium">Subject</th>
                <th className="text-left py-3 px-4 text-gray-700 font-medium">Progress</th>
                <th className="text-left py-3 px-4 text-gray-700 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {assignedStudents.map((student) => (
                <tr key={student.id} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-gray-900">{student.name}</td>
                  <td className="py-3 px-4 text-gray-600">{student.subjects.join(', ')}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                      <span className="text-gray-600 text-sm">{student.progress}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      student.progress >= 70 ? 'bg-green-100 text-green-600' :
                      student.progress >= 40 ? 'bg-yellow-100 text-yellow-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {student.progress >= 70 ? 'On Track' : student.progress >= 40 ? 'Needs Support' : 'At Risk'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Alerts */}
      {pendingDoubts.length > 0 && (
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Pending Doubts</h2>
          <div className="space-y-3">
            {pendingDoubts.slice(0, 3).map((doubt) => (
              <div key={doubt.id} className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">{doubt.studentName}</p>
                    <p className="text-gray-600 text-sm">{doubt.subject} • {doubt.topic}</p>
                    <p className="text-gray-700 mt-2">{doubt.question}</p>
                  </div>
                  <span className="text-yellow-600 text-sm">{doubt.date}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default MentorDashboard;
