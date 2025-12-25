import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Rewards from "./components/Rewards";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected rewards route */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Rewards />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
