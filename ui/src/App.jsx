import { Navigate, Route, Routes } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";

import Dashboard from "./features/Dashboard/Dashboard";
import Controls from "./features/Controls/Controls";
import History from "./features/History/History";
import About from "./features/About/About";
import Login from "./features/Login/Login";
import Error from "./features/Error/Error";

import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={<RootLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="controls" element={<Controls />} />
        <Route path="history" element={<History />} />
        <Route path="about" element={<About />} />
        <Route path="error" element={<Error />} />
      </Route>

      <Route path="*" element={<Navigate to="/error" replace />} />
    </Routes>
  );
}

export default App;