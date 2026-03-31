import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  BookOpen, Star, Flame, Trophy, Target, ChevronRight, AlertCircle
} from 'lucide-react';

const StudentDashboard = () => {
  const { appData, currentUser } = useApp();
  const navigate = useNavigate();
  
  const student = appData.students.find(s => s.id === currentUser?.id) || appData.students[0];
  const nextLevelXP = 1000;
  const progressPercent = Math.min((student.xp / nextLevelXP) * 100, 100);

  // Determine UI mode based on age
  // Ages 5-10 (classes 1-5): Foundation - playful, colorful, gamified
  // Ages 11-14 (classes 6-8): Growth - streak-based, normal
  // Ages 15-19 (classes 9-12): Mastery - professional, clean
  const getUIMode = () => {
    if (student.age <= 10) return 'foundation';
    if (student.age <= 14) return 'growth';
    return 'mastery';
  };
  
  const uiMode = getUIMode();

  const subjects = [
    { name: 'Mathematics', img: '/images/math_3d.png' },
    { name: 'English', img: '/images/english_3d.png' },
    { name: 'Science', img: '/images/science_3d.png' },
  ];

  const badges = [
    { icon: Star, name: 'First Star', color: 'text-amber-500', bg: 'bg-amber-50', unlocked: true },
    { icon: Flame, name: 'Streak Pro', color: 'text-orange-500', bg: 'bg-orange-50', unlocked: student.streak >= 5 },
    { icon: BookOpen, name: 'Bookworm', color: 'text-blue-500', bg: 'bg-blue-50', unlocked: true },
    { icon: Target, name: 'Sharpshooter', color: 'text-red-500', bg: 'bg-red-50', unlocked: false },
    { icon: Trophy, name: 'Champion', color: 'text-emerald-500', bg: 'bg-emerald-50', unlocked: false },
  ];

  // FOUNDATION MODE (Ages 5-10) - Playful & Colorful
  if (uiMode === 'foundation') {
    return (
      <div className="space-y-5 max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl border-2 border-slate-200">
          <div className="flex items-center p-6 md:p-8">
            <div className="flex-1">
              <p className="text-slate-500 text-sm font-medium mb-1">Hello there,</p>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-2">{student.name}!</h1>
              <p className="text-slate-600 text-base mb-4">Ready to learn something amazing today?</p>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-bold border-2 border-amber-200">
                <Trophy className="w-4 h-4" /> Level {student.level_number}
              </span>
            </div>
            <img 
              src="/images/hero_kids.png" 
              alt="Learning" 
              className="w-32 h-32 md:w-48 md:h-48 object-contain flex-shrink-0"
            />
          </div>
        </div>

        {/* XP Progress */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-5 md:p-6 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-slate-800 flex items-center gap-2 text-lg">
              <Star className="w-5 h-5 text-amber-500" /> Level Progress
            </span>
            <span className="text-base font-black text-slate-700">{student.xp} / {nextLevelXP} XP</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden shadow-inner">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 transition-all duration-700 shadow-lg"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-sm text-slate-500 font-bold">
            <span>Lv {student.level_number}</span>
            <span>Lv {student.level_number + 1}</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-3xl p-6 border-2 border-amber-200 shadow-lg">
            <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-3 shadow-md">
              <Star className="w-7 h-7 text-amber-500" />
            </div>
            <p className="text-4xl font-black text-slate-900 mb-1">{student.xp}</p>
            <p className="text-sm font-bold text-slate-600">Stars Earned</p>
            <p className="text-xs font-semibold text-amber-600 mt-1">Keep going!</p>
          </div>

          <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl p-6 border-2 border-rose-200 shadow-lg">
            <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center mb-3 shadow-md">
              <Flame className="w-7 h-7 text-rose-500" />
            </div>
            <p className="text-4xl font-black text-slate-900 mb-1">{student.streak}d</p>
            <p className="text-sm font-bold text-slate-600">Day Streak</p>
            <p className="text-xs font-semibold text-rose-600 mt-1">On fire!</p>
          </div>
        </div>

        {/* My Subjects */}
        <div>
          <h2 className="text-2xl font-black text-slate-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-500" /> My Subjects
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {subjects.map((subject, i) => (
              <div
                key={i}
                onClick={() => navigate('/courses')}
                className="relative aspect-square rounded-3xl overflow-hidden cursor-pointer hover:scale-105 transition-transform group shadow-xl bg-white"
              >
                <img 
                  src={subject.img} 
                  alt={subject.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900/80 to-transparent p-3">
                  <p className="text-white text-sm md:text-base font-black text-center drop-shadow-lg">
                    {subject.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Challenge */}
        <div 
          className="relative bg-white rounded-3xl p-6 overflow-hidden shadow-xl border-2 border-slate-200 cursor-pointer hover:shadow-2xl transition-all"
          onClick={() => navigate('/courses')}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-slate-600 text-sm font-bold">Daily Challenge</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Complete 3 Lessons Today!</h3>
              <p className="text-slate-600 text-sm mb-4">Earn bonus XP and unlock special rewards</p>
              <button className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors shadow-lg flex items-center gap-2">
                Start Challenge <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <img 
              src="/images/daily_challenge.png" 
              alt="Challenge"
              className="w-32 h-32 md:w-40 md:h-40 object-contain"
            />
          </div>
        </div>

        {/* My Badges */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 p-5 md:p-6 shadow-lg">
          <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" /> My Badges
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {badges.map((badge, i) => {
              const BadgeIcon = badge.icon;
              return (
                <div
                  key={i}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 text-center transition-all
                    ${badge.unlocked 
                      ? `${badge.bg} border-slate-200 shadow-md hover:scale-105` 
                      : 'bg-slate-50 border-slate-100 opacity-40 grayscale'
                    }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${badge.unlocked ? badge.bg : 'bg-slate-100'} shadow-sm`}>
                    <BadgeIcon className={`w-6 h-6 ${badge.unlocked ? badge.color : 'text-slate-400'}`} />
                  </div>
                  <p className="text-xs font-bold text-slate-700 leading-tight">{badge.name}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // GROWTH MODE (Ages 11-14) - Streak-based & Normal
  if (uiMode === 'growth') {
    return (
      <div className="space-y-6 max-w-6xl mx-auto px-4 md:px-0">
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-200 shadow-sm">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Welcome back, {student.name}!</h1>
          <p className="text-gray-600 text-sm md:text-base">Keep your streak alive and reach new milestones</p>
        </div>

        {/* Streak & XP Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 md:p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-xl md:text-2xl font-bold text-gray-900">{student.streak} Days</p>
                <p className="text-sm text-gray-500">Current Streak</p>
              </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${Math.min((student.streak / 30) * 100, 100)}%` }} />
            </div>
            <p className="text-xs text-gray-400 mt-2">Goal: 30 days</p>
          </div>

          <div className="bg-white rounded-xl p-4 md:p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-xl md:text-2xl font-bold text-gray-900">{student.xp} XP</p>
                <p className="text-sm text-gray-500">Total Experience</p>
              </div>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${progressPercent}%` }} />
            </div>
            <p className="text-xs text-gray-400 mt-2">Level {student.level_number} → {student.level_number + 1}</p>
          </div>

          <div className="bg-white rounded-xl p-4 md:p-5 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-xl md:text-2xl font-bold text-gray-900">Level {student.level_number}</p>
                <p className="text-sm text-gray-500">Current Level</p>
              </div>
            </div>
          </div>
        </div>

        {/* Subjects Grid */}
        <div>
          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">My Subjects</h2>
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {/* Mathematics */}
            <div
              onClick={() => navigate('/courses')}
              className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="relative h-28 md:h-32 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&q=80" 
                  alt="Mathematics"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative h-full p-2 md:p-3 flex flex-col justify-between text-white">
                  <div className="w-7 h-7 md:w-8 md:h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <BookOpen className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                  </div>
                  <p className="font-bold text-xs md:text-sm">Mathematics</p>
                </div>
              </div>
              <div className="p-2 bg-white">
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '75%' }} />
                </div>
              </div>
            </div>

            {/* English */}
            <div
              onClick={() => navigate('/courses')}
              className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="relative h-28 md:h-32 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500&q=80" 
                  alt="English"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative h-full p-2 md:p-3 flex flex-col justify-between text-white">
                  <div className="w-7 h-7 md:w-8 md:h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <BookOpen className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                  </div>
                  <p className="font-bold text-xs md:text-sm">English</p>
                </div>
              </div>
              <div className="p-2 bg-white">
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '60%' }} />
                </div>
              </div>
            </div>

            {/* Science */}
            <div
              onClick={() => navigate('/courses')}
              className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className="relative h-28 md:h-32 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&q=80" 
                  alt="Science"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                />
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative h-full p-2 md:p-3 flex flex-col justify-between text-white">
                  <div className="w-7 h-7 md:w-8 md:h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <BookOpen className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                  </div>
                  <p className="font-bold text-xs md:text-sm">Science</p>
                </div>
              </div>
              <div className="p-2 bg-white">
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: '82%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Study Plan */}
        <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base md:text-lg font-bold text-gray-900">Today's Study Plan</h2>
            <button 
              onClick={() => navigate('/study-plan')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View All →
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm">Mathematics - Algebra</p>
                <p className="text-xs text-gray-500 mt-1">Quadratic Equations</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="text-xs text-gray-400">9:00 AM - 10:00 AM</span>
                  <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 rounded">In Progress</span>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm">English - Grammar</p>
                <p className="text-xs text-gray-500 mt-1">Tenses Practice</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <span className="text-xs text-gray-400">2:00 PM - 3:00 PM</span>
                  <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">Scheduled</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 shadow-sm">
          <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4">Achievements</h2>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-3">
            {badges.map((badge, i) => {
              const BadgeIcon = badge.icon;
              return (
                <div
                  key={i}
                  className={`flex flex-col items-center gap-2 p-3 md:p-4 rounded-lg border text-center transition-all
                    ${badge.unlocked 
                      ? 'bg-white border-gray-200 hover:shadow-md' 
                      : 'bg-gray-50 border-gray-100 opacity-50'
                    }`}
                >
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center ${badge.unlocked ? badge.bg : 'bg-gray-100'}`}>
                    <BadgeIcon className={`w-5 h-5 md:w-6 md:h-6 ${badge.unlocked ? badge.color : 'text-gray-400'}`} />
                  </div>
                  <p className="text-xs font-medium text-gray-700 leading-tight">{badge.name}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // MASTERY MODE (Ages 15-19) - Professional & Clean
  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 md:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1 text-sm md:text-base">Welcome back, {student.name}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-gray-100 rounded-lg">
            <span className="text-sm text-gray-600">Level</span>
            <span className="ml-2 font-semibold text-gray-900">{student.level_number}</span>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white rounded-lg p-4 md:p-5 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs md:text-sm text-gray-500">Total XP</span>
            <Star className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-xl md:text-2xl font-semibold text-gray-900">{student.xp}</p>
          <div className="mt-3 w-full bg-gray-100 rounded-full h-1.5">
            <div className="bg-gray-900 h-1.5 rounded-full" style={{ width: `${progressPercent}%` }} />
          </div>
          <p className="text-xs text-gray-400 mt-2">{Math.round(progressPercent)}% to next level</p>
        </div>

        <div className="bg-white rounded-lg p-4 md:p-5 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs md:text-sm text-gray-500">Streak</span>
            <Flame className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-xl md:text-2xl font-semibold text-gray-900">{student.streak} days</p>
          <p className="text-xs text-gray-500 mt-3">Keep learning daily</p>
        </div>

        <div className="bg-white rounded-lg p-4 md:p-5 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs md:text-sm text-gray-500">Progress</span>
            <Target className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-xl md:text-2xl font-semibold text-gray-900">{student.progress}%</p>
          <p className="text-xs text-gray-500 mt-3">Overall completion</p>
        </div>

        <div className="bg-white rounded-lg p-4 md:p-5 border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs md:text-sm text-gray-500">Attendance</span>
            <BookOpen className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-xl md:text-2xl font-semibold text-gray-900">{student.attendance}%</p>
          <p className="text-xs text-gray-500 mt-3">This month</p>
        </div>
      </div>

      {/* Subjects */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
        <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4">My Subjects</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* Mathematics Card */}
          <div
            onClick={() => navigate('/courses')}
            className="group cursor-pointer rounded-xl overflow-hidden border border-gray-200 hover:border-gray-300 transition-all"
          >
            <div className="relative h-40 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&q=80" 
                alt="Mathematics"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="relative h-full p-4 flex flex-col justify-between text-white">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/80" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Mathematics</h3>
                  <p className="text-xs text-white/80">12 chapters • 45 topics</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">Progress</span>
                <span className="text-sm font-semibold text-gray-900">75%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
                <div className="bg-gray-900 h-1.5 rounded-full" style={{ width: '75%' }} />
              </div>
              
              {/* Weak Topics */}
              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1.5 mb-2">
                  <AlertCircle className="w-3.5 h-3.5 text-orange-500" />
                  <span className="text-xs font-medium text-gray-700">Areas to improve</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-xs px-2 py-1 bg-orange-50 text-orange-700 rounded border border-orange-200">
                    Calculus
                  </span>
                  <span className="text-xs px-2 py-1 bg-orange-50 text-orange-700 rounded border border-orange-200">
                    Trigonometry
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* English Card */}
          <div
            onClick={() => navigate('/courses')}
            className="group cursor-pointer rounded-xl overflow-hidden border border-gray-200 hover:border-gray-300 transition-all"
          >
            <div className="relative h-40 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500&q=80" 
                alt="English"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="relative h-full p-4 flex flex-col justify-between text-white">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/80" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">English</h3>
                  <p className="text-xs text-white/80">10 chapters • 38 topics</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">Progress</span>
                <span className="text-sm font-semibold text-gray-900">60%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
                <div className="bg-gray-900 h-1.5 rounded-full" style={{ width: '60%' }} />
              </div>
              
              {/* Weak Topics */}
              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1.5 mb-2">
                  <AlertCircle className="w-3.5 h-3.5 text-orange-500" />
                  <span className="text-xs font-medium text-gray-700">Areas to improve</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-xs px-2 py-1 bg-orange-50 text-orange-700 rounded border border-orange-200">
                    Grammar
                  </span>
                  <span className="text-xs px-2 py-1 bg-orange-50 text-orange-700 rounded border border-orange-200">
                    Essay Writing
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Science Card */}
          <div
            onClick={() => navigate('/courses')}
            className="group cursor-pointer rounded-xl overflow-hidden border border-gray-200 hover:border-gray-300 transition-all"
          >
            <div className="relative h-40 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&q=80" 
                alt="Science"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="relative h-full p-4 flex flex-col justify-between text-white">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/80" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Science</h3>
                  <p className="text-xs text-white/80">15 chapters • 52 topics</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">Progress</span>
                <span className="text-sm font-semibold text-gray-900">82%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3">
                <div className="bg-gray-900 h-1.5 rounded-full" style={{ width: '82%' }} />
              </div>
              
              {/* Weak Topics */}
              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1.5 mb-2">
                  <AlertCircle className="w-3.5 h-3.5 text-orange-500" />
                  <span className="text-xs font-medium text-gray-700">Areas to improve</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-xs px-2 py-1 bg-orange-50 text-orange-700 rounded border border-orange-200">
                    Organic Chemistry
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Study Plan */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base md:text-lg font-semibold text-gray-900">Today's Study Plan</h2>
          <button 
            onClick={() => navigate('/study-plan')}
            className="text-sm text-gray-900 hover:text-gray-700 font-medium flex items-center gap-1"
          >
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5 text-gray-700" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-sm">Mathematics - Calculus</p>
              <p className="text-xs text-gray-500 mt-1">Chapter 5: Derivatives</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-400">9:00 AM - 10:00 AM</span>
                <span className="text-xs px-2 py-0.5 bg-gray-900 text-white rounded">In Progress</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5 text-gray-700" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-sm">English - Literature</p>
              <p className="text-xs text-gray-500 mt-1">Essay Writing Practice</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-400">2:00 PM - 3:00 PM</span>
                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">Scheduled</span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-5 h-5 text-gray-700" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 text-sm">Science - Physics</p>
              <p className="text-xs text-gray-500 mt-1">Newton's Laws of Motion</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-400">4:00 PM - 5:00 PM</span>
                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">Scheduled</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
