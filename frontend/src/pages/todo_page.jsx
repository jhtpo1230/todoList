import Sidebar from "../components/sidebar";
import TodoContainer from "../components/todo_container";

export default function TodoPage() {
  return (
    <div className="todo-page">
      <Sidebar />
      <TodoContainer />
    </div>
  );
}
