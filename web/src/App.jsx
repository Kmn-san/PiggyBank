import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import SignUpPage from "./pages/SignUpPage"
import PrivacyPolicy from "./pages/PrivacyPage"
import TermsOfService from "./pages/TermsPage"
import PublicRoute from "./components/PublicRoute"
import Dashboard from "./pages/Dashboard"
import ProtectedRoute from "./components/ProtectRoute"
import AppLayout from "./components/AppLayout"
import SavingsPage from "./pages/SavingsPage"
import ExpensesPage from "./pages/ExpensesPage"

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route element={<PublicRoute />}>
          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route
            path="/signup"
            element={<SignUpPage />}
          />
        </Route>

        <Route
          path="/privacy"
          element={<PrivacyPolicy />}
        />

        <Route
          path="/terms"
          element={<TermsOfService />}
        />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/savings"
              element={<SavingsPage />}
            />

            <Route
              path="/expenses"
              element={<ExpensesPage />}
            />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App