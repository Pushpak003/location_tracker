import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ShareTracking from "./pages/ShareTracking";
import ViewTracking from "./pages/ViewTracking";

function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />
        
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

          <Route
          path="/share/:trackingId"
          element={<ShareTracking />}
        />

        <Route
          path="/view/:trackingId"
          element={<ViewTracking />}
        />


      </Routes>

    </BrowserRouter>
  );
}

export default App;