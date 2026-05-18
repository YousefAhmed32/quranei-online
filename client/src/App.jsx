import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { ProtectedRoute, GuestRoute } from './components/auth/ProtectedRoute';
import AIAssistant from './components/ai/AIAssistant';
import FloatingWhatsApp from './components/ui/FloatingWhatsApp';

// Public pages
import HomePage           from './pages/public/HomePage';
import CoursesPage        from './pages/public/CoursesPage';
import CourseDetailPage   from './pages/public/CourseDetailPage';
import CoursePreviewPage  from './pages/public/CoursePreviewPage';
import TeachersPage       from './pages/public/TeachersPage';
import TeacherProfilePage from './pages/public/TeacherProfilePage';
import ProgramsPage       from './pages/public/ProgramsPage';
import PricingPage        from './pages/public/PricingPage';
import ContactPage        from './pages/public/ContactPage';
import AboutPage          from './pages/public/AboutPage';
import TestimonialsPage   from './pages/public/TestimonialsPage';
import FaqPage            from './pages/public/FaqPage';

// Auth pages
import LoginPage    from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Student pages
import StudentDashboard from './pages/student/StudentDashboard';
import CoursePage       from './pages/student/CoursePage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } }
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/"                     element={<HomePage />} />
          <Route path="/about"                element={<AboutPage />} />
          <Route path="/courses"              element={<CoursesPage />} />
          <Route path="/courses/:slug/preview" element={<CoursePreviewPage />} />
          <Route path="/courses/:slug"        element={<CourseDetailPage />} />
          <Route path="/teachers"             element={<TeachersPage />} />
          <Route path="/teachers/:identifier" element={<TeacherProfilePage />} />
          <Route path="/programs"             element={<ProgramsPage />} />
          <Route path="/pricing"              element={<PricingPage />} />
          <Route path="/contact"              element={<ContactPage />} />
          <Route path="/testimonials"         element={<TestimonialsPage />} />
          <Route path="/faq"                  element={<FaqPage />} />

          {/* Auth */}
          <Route path="/login"    element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

          {/* Student */}
          <Route path="/dashboard"         element={<ProtectedRoute roles={['student','admin','teacher']}><StudentDashboard /></ProtectedRoute>} />
          <Route path="/course/:courseId"  element={<ProtectedRoute roles={['student','admin','teacher']}><CoursePage /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin"   element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/*" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />

          {/* 404 */}
          <Route path="*" element={
            <div className="min-h-screen bg-[#070f1c] flex items-center justify-center text-white" dir="rtl">
              <div className="text-center">
                <div className="text-8xl font-bold text-[#dfab70] mb-4">٤٠٤</div>
                <p className="text-[#5e779a] text-lg mb-6">الصفحة غير موجودة</p>
                <a href="/" className="px-8 py-3 rounded-xl font-bold text-[#070f1c]"
                  style={{ background: 'linear-gradient(135deg,#906130,#dfab70)' }}>
                  العودة للرئيسية
                </a>
              </div>
            </div>
          } />
        </Routes>

        {/* Global floating widgets */}
        <FloatingWhatsApp />
        <AIAssistant />

        <Toaster
          position="top-left"
          containerStyle={{ direction: 'rtl' }}
          toastOptions={{
            duration: 3500,
            style: {
              background:    'rgba(10,22,40,0.97)',
              color:         '#fff',
              border:        '1px solid rgba(223,171,112,0.18)',
              fontFamily:    'Cairo, sans-serif',
              direction:     'rtl',
              borderRadius:  '14px',
              padding:       '12px 16px',
              fontSize:      '13px',
              boxShadow:     '0 8px 32px rgba(0,0,0,0.5)',
              backdropFilter: 'blur(20px)',
            },
            success: { iconTheme: { primary: '#22c55e', secondary: '#0a1628' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#0a1628' } },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
