import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import Home from "./components/Home";
import Alerts from "./components/Alerts";
import State from "./components/State";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#F5F7FA] text-gray-800">
        <header className="bg-white shadow p-4 mb-2">
          <h1 className="text-4xl font-bold text-[#0066FF]">🌤️ Weather Alerts</h1>
        </header>

        <nav className="bg-white shadow-sm p-3 flex justify-center gap-10 text-lg mb-6">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive
                ? "text-[#0066FF] font-semibold underline"
                : "text-gray-600 hover:text-[#0066FF]"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/alerts"
            className={({ isActive }) =>
              isActive
                ? "text-[#0066FF] font-semibold underline"
                : "text-gray-600 hover:text-[#0066FF]"
            }
          >
            Alerts
          </NavLink>
          <NavLink
            to="/state"
            className={({ isActive }) =>
              isActive
                ? "text-[#0066FF] font-semibold underline"
                : "text-gray-600 hover:text-[#0066FF]"
            }
          >
            State
          </NavLink>
        </nav>

        <main className="max-w-7xl mx-auto px-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/state" element={<State />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
