import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TodoPage from "./pages/todo_page";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TodoPage />} />
         {/* 나머지 추후에 추가예정 */}
      </Routes>
    </Router>
  );
}

export default App;