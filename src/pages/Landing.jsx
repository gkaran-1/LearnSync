import { useNavigate } from 'react-router-dom';
import { SmokeBackground } from '../components/ui/SmokeBackground';
import { BookOpen, Users, Brain, Sparkles, TrendingUp, Award, ArrowRight, CheckCircle } from 'lucide-react';
import Button from '../components/Button';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Learning',
      description: 'Personalized study plans and intelligent tutoring that adapts to your learning style',
      color: 'from-red-500 to-red-700'
    },
    {
      icon: Users,
      title: 'Expert Mentors',
      description: 'Connect with qualified mentors who guide you through your educational journey',
      color: 'from-gray-700 to-gray-900'
    },
    {
      icon: TrendingUp,
      title: 'Track Progress',
      description: 'Monitor your learning journey with detailed analytics and achievement tracking',
      color: 'from-red-600 to-black'
    },
    {
      icon: Sparkles,
      title: 'Interactive Content',
      description: 'Engage with dynamic courses, quizzes, and hands-on learning materials',
      color: 'from-red-500 to-red-700'
    },
    {
      icon: Award,
      title: 'Gamified Learning',
      description: 'Earn XP, unlock achievements, and compete with peers to stay motivated',
      color: 'from-gray-700 to-gray-900'
    },
    {
      icon: BookOpen,
      title: 'Comprehensive Courses',
      description: 'Access subjects aligned with Indian education standards',
      color: 'from-red-600 to-black'
    }
  ];

  const stats = [
    { value: '10K+', label: 'Active Students' },
    { value: '500+', label: 'Expert Mentors' },
    { value: '50+', label: 'Courses' },
    { value: '95%', label: 'Success Rate' }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0 opacity-70">
        <SmokeBackground smokeColor="#dc2626" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="absolute top-0 left-0 right-0 px-4 sm:px-6 py-4 sm:py-6 z-20">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-red-600 to-red-800 rounded-lg sm:rounded-xl flex items-center justify-center">
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-white">LearnSync</span>
            </div>
            <Button 
              onClick={() => navigate('/login')}
              className="bg-transparent backdrop-blur-sm border-2 border-red-600 text-white hover:bg-red-600 hover:bg-opacity-20 text-sm sm:text-base px-4 sm:px-6 py-2 flex items-center gap-2"
            >
              <span className="hidden sm:inline">Get Started</span>
              <span className="sm:hidden">Start</span>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </nav>

        {/* Hero Section - Full Screen */}
        <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 pt-20 sm:pt-0">
          <div className="max-w-7xl mx-auto w-full">
            <div className="text-center space-y-4 sm:space-y-8">
              <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-red-600 to-red-800 rounded-full text-white text-xs sm:text-sm font-medium mb-2 sm:mb-4">
                AI-Powered Education Platform
              </div>
              
              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-tight px-4">
                Empowering
                <br />
                <span className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent">
                  Education
                </span>
                <br />
                Through AI
              </h1>
              
              <p className="text-base sm:text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">
                A comprehensive learning platform connecting students, mentors, and NGOs
                with AI-powered personalized education
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2 sm:pt-4 px-4">
                <Button 
                  onClick={() => navigate('/login')}
                  className="bg-transparent backdrop-blur-sm border-2 border-red-600 text-white hover:bg-red-600 hover:bg-opacity-20 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg shadow-2xl shadow-red-500/30 flex items-center gap-2"
                >
                  Start Learning Free
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
                <Button 
                  variant="secondary" 
                  className="bg-transparent backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:bg-opacity-10 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg"
                >
                  Watch Demo
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 pt-8 sm:pt-16 px-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent mb-1 sm:mb-2">
                      {stat.value}
                    </div>
                    <div className="text-gray-400 text-xs sm:text-sm">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 sm:px-6 py-20 sm:py-32 relative bg-black">
          <div className="max-w-7xl mx-auto relative">
            <div className="text-center mb-16 sm:mb-20">
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
                Everything You Need to Succeed
              </h2>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-400 font-light">
                Powerful features designed for modern learning
              </p>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative bg-zinc-900 bg-opacity-50 backdrop-blur-sm p-8 sm:p-10 rounded-2xl border border-zinc-800 hover:border-red-900 transition-all duration-300 hover:transform hover:scale-[1.02]"
                >
                  <div className={`w-16 h-16 sm:w-18 sm:h-18 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 sm:mb-8 group-hover:scale-110 transition-transform shadow-lg`}>
                    <feature.icon className="w-8 h-8 sm:w-9 sm:h-9 text-white" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-base sm:text-lg text-gray-400 leading-relaxed font-light">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="px-4 sm:px-6 py-20 sm:py-32 bg-black">
          <div className="max-w-6xl mx-auto">
            <div className="relative bg-gradient-to-br from-red-600 via-red-700 to-red-900 rounded-3xl sm:rounded-[2.5rem] p-10 sm:p-16 md:p-20 overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-32 translate-x-32"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-black opacity-10 rounded-full translate-y-48 -translate-x-48"></div>
              
              <div className="relative z-10">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 sm:mb-6 text-center tracking-tight">
                  Why Choose LearnSync?
                </h2>
                <p className="text-lg sm:text-xl text-red-100 text-center mb-12 sm:mb-16 font-light">
                  Join the future of education with our comprehensive platform
                </p>
                
                <div className="grid sm:grid-cols-2 gap-6 sm:gap-8">
                  {[
                    'Personalized AI-driven learning paths',
                    'Real-time progress tracking',
                    'Expert mentor support 24/7',
                    'Interactive quizzes and assessments',
                    'Gamified learning experience',
                    'Aligned with Indian curriculum'
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mt-0.5">
                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <span className="text-white text-base sm:text-lg md:text-xl font-medium leading-relaxed">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 sm:px-6 py-16 sm:py-24 bg-black">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
              Ready to Transform
              <br />
              Your Learning?
            </h2>
            <p className="text-base sm:text-xl text-gray-400 mb-8 sm:mb-12">
              Join thousands of students already learning smarter with LearnSync
            </p>
            <Button 
              onClick={() => navigate('/login')}
              className="bg-transparent backdrop-blur-sm border-2 border-red-600 text-white hover:bg-red-600 hover:bg-opacity-20 px-8 sm:px-12 py-4 sm:py-5 text-lg sm:text-xl shadow-2xl shadow-red-500/30 flex items-center gap-2"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="px-6 py-12 border-t border-red-900 border-opacity-30 bg-black">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-800 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">LearnSync</span>
              </div>
              <p className="text-gray-400">
                &copy; 2024 LearnSync. Empowering education through technology.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
