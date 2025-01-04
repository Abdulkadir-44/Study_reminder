import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from '../pages/Authentication/Login';
import Register from '../pages/Authentication/Register';
import Dashboard from '../pages/Panel/Dashboard';
import ResetPassword from '../pages/Authentication/ResetPassword';
import LessonsList from '../pages/Panel/LessonsList';

// Protected Route komponenti
const ProtectedRoute = ({ children }) => {
    const { user } = useSelector((state) => state.user);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

// Public Route komponenti (giriş yapmış kullanıcılar erişememeli)
const PublicRoute = ({ children }) => {
    const { user } = useSelector((state) => state.user);

    if (user) {
        return <Navigate to="/panel" replace />;
    }

    return children;
};

const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route
                    path="/login"
                    element={
                        <PublicRoute>
                            <Login />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <PublicRoute>
                            <Register />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/reset-password/:token"
                    element={
                        <PublicRoute>
                            <ResetPassword />
                        </PublicRoute>
                    }
                />

                {/* Protected Routes */}
                <Route
                    path="/panel"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                {/* Protected Routes */}
                <Route
                    path="/lessons"
                    element={
                        <ProtectedRoute>
                            <LessonsList />
                        </ProtectedRoute>
                    }
                />

                {/* Ana sayfa yönlendirmesi */}
                <Route
                    path="/"
                    element={<Navigate to="/panel" replace />}
                />

                {/* 404 sayfası veya geçersiz rotalar için yönlendirme */}
                <Route
                    path="*"
                    element={<Navigate to="/login" replace />}
                />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;