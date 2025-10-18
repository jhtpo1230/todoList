import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { useState } from "react";
import TodoPage from "./pages/todo_page";
import LoginPage from "./pages/login_page";
import SignupPage from "./pages/signup_page";

function App() {
    const [userId, setUserId] = useState(
        localStorage.getItem("userId") || null // 새로고침에도 유지
    );
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route
                    path="/login"
                    element={<LoginPage setUserId={setUserId} />}
                />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/todo" element={<TodoPage userId={userId} />} />
                {/* 나머지 추후에 추가예정 */}
            </Routes>
        </Router>
    );
}

export default App;
