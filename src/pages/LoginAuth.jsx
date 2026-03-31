import { useState } from 'react';
import {
  Mail, Lock, UserPlus, LogIn, GraduationCap,
  Rocket, Target, Users, ArrowRight, Eye, EyeOff, Shield
} from 'lucide-react';
import { signIn, signUp, signInWithGoogle } from '../services/auth';

const LoginAuth = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({ email: '', password: '', name: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleGoogleSignIn = async () => {
    setError(''); setLoading(true);
    try {
      const result = await signInWithGoogle(role);
      if (result.success) onLogin(result.user, result.role);
      else setError(result.error);
    } catch { setError('An unexpected error occurred'); }
    finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      if (isSignUp) {
        if (formData.password !== formData.confirmPassword) { setError('Passwords do not match'); return; }
        if (formData.password.length < 6) { setError('Password must be at least 6 characters'); return; }
        const result = await signUp(formData.email, formData.password, { name: formData.name, role, onboarded: false });
        if (result.success) onLogin(result.user, role);
        else setError(result.error);
      } else {
        const result = await signIn(formData.email, formData.password);
        if (result.success) onLogin(result.user, result.role);
        else setError(result.error);
      }
    } catch { setError('An unexpected error occurred'); }
    finally { setLoading(false); }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const mockUsers = [
    {
      id: 'student_1', name: 'Priya Sharma', age: 9, class: '4th', level: 'foundation',
      iconType: 'foundation', role: 'student', subjects: ['Math', 'English'],
      mentorId: 2, progress: 45, xp: 280, level_number: 3, streak: 5, attendance: 70, onboarded: true,
      weakTopics: { Math: ['subtraction'], English: ['reading'] }, strongTopics: { Math: ['counting'] }, completedTopics: [1,2,3,8,10]
    },
    {
      id: 'student_2', name: 'Aarav Kumar', age: 12, class: '7th', level: 'growth',
      iconType: 'growth', role: 'student', subjects: ['Math', 'Science', 'English'],
      mentorId: 1, progress: 65, xp: 450, level_number: 5, streak: 12, attendance: 85, onboarded: true,
      weakTopics: { Math: ['fractions', 'decimals'], Science: ['photosynthesis'] },
      strongTopics: { Math: ['addition'], English: ['grammar'] }, completedTopics: [1,2,4,5,10,11,19,20,23,24,27]
    },
    {
      id: 'student_3', name: 'Rohan Patel', age: 16, class: '11th', level: 'mastery',
      iconType: 'mastery', role: 'student', subjects: ['Math', 'Science', 'English', 'Computer Science'],
      mentorId: 1, progress: 78, xp: 890, level_number: 9, streak: 20, attendance: 88, onboarded: true,
      weakTopics: { Math: ['calculus'], Science: ['organic chemistry'] },
      strongTopics: { Math: ['algebra'], English: ['essay writing'] },
      completedTopics: [1,2,3,4,5,6,7,10,11,19,20,21,33,34,35,37,38,45,46,47]
    },
    {
      id: 'mentor_1',
      name: 'Dr. Anjali Verma',
      role: 'mentor',
      iconType: 'mentor',
      subjects: ['Math', 'Science'],
      education: 'M.Sc Mathematics',
      skillLevel: 'advanced',
      experience: 5,
      teachingExperience: true,
      ratings: { Math: 5, Science: 4 },
      assignedStudents: ['student_2', 'student_3'],
      sessionsCompleted: 45,
      avgImprovement: 25,
      onboarded: true
    },
    {
      id: 'admin',
      name: 'Admin User',
      role: 'admin',
      iconType: 'admin',
      organization: 'LearnSync NGO',
      email: 'admin@demo.com',
      onboarded: true
    }
  ];

  const handleMockLogin = (user) => {
    setError(''); setLoading(true);
    try { onLogin(user, user.role, mockUsers); }
    catch { setError('Demo login failed. Please try again.'); }
    finally { setLoading(false); }
  };

  const IconMap = {
    foundation: GraduationCap,
    growth: Rocket,
    mastery: Target,
    mentor: Users,
    admin: Shield
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Demo Accounts */}
      <div className="hidden lg:flex lg:w-2/5 bg-white p-12 flex-col">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Experience <span className="text-red-600">LearnSync</span>
          </h1>
          <p className="text-gray-600 text-sm">
            Select a demo profile to explore our AI-powered learning environment instantly.
          </p>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto">
          {mockUsers.map((user) => {
            const UserIcon = IconMap[user.iconType] || GraduationCap;
            
            return (
              <button
                key={user.id}
                onClick={() => handleMockLogin(user)}
                disabled={loading}
                className="w-full p-4 rounded-lg bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200 text-left group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <UserIcon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900">{user.name}</div>
                    {user.role === 'student' ? (
                      <div className="text-xs text-gray-500">
                        Student • Class {user.class} • {user.level}
                      </div>
                    ) : user.role === 'mentor' ? (
                      <div className="text-xs text-gray-500">
                        Mentor • {user.subjects.join(' & ')}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-500">
                        NGO Administrator • Full Access
                      </div>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            © 2026 LearnSync • AI-Powered Learning Platform
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-md my-auto">
          {/* Logo for mobile */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">LearnSync</span>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="text-red-600 text-sm font-semibold mb-2">LearnSync</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-4">AI-Powered Learning Platform</div>
              <h2 className="text-2xl font-bold text-gray-900">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h2>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter your name"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">I am a</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setRole('student')}
                        className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                          role === 'student'
                            ? 'border-red-600 bg-red-50 text-red-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <GraduationCap className="w-5 h-5 mx-auto mb-1" />
                        Student
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole('mentor')}
                        className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                          role === 'mentor'
                            ? 'border-red-600 bg-red-50 text-red-700'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Users className="w-5 h-5 mx-auto mb-1" />
                        Mentor
                      </button>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="name@university.edu"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  {!isSignUp && (
                    <button type="button" className="text-xs text-red-600 hover:text-red-700 font-medium">
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {isSignUp && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : isSignUp ? (
                  <><UserPlus className="w-4 h-4" /> Sign Up</>
                ) : (
                  <><LogIn className="w-4 h-4" /> Sign In</>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-white text-xs text-gray-500">OR</span>
              </div>
            </div>

            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>

            {/* Toggle Sign Up/In */}
            <p className="mt-6 text-center text-sm text-gray-600">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError('');
                  setFormData({ email: '', password: '', name: '', confirmPassword: '' });
                }}
                className="text-red-600 font-semibold hover:text-red-700"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>

            {/* Admin Access Note */}
            <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800">
                <strong>ADMIN ACCESS</strong><br />
                Platform administrators must use the designated institution portal for secure credentialing and oversight.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginAuth;
