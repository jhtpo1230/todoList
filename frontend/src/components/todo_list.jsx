import TodoItem from "./todo_item";
import "../styles/todo_list.css";
export default function TodoList({ todos, onDelete, onUpdate, onToggle }) {
    const todoList = todos.filter((t) => !t.completed);
    const doneList = todos.filter((t) => t.completed);

    return (
        <div className="todo-list">
            <section>
                <h3>TO DO</h3>
                {todoList.length ? (
                    todoList.map((t) => (
                        <TodoItem
                            key={t.id}
                            todo={t}
                            onDelete={onDelete}
                            onToggle={onToggle}
                            onUpdate={onUpdate}
                        />
                    ))
                ) : (
                    <p>할 일 항목이 없습니다.</p>
                )}
            </section>

            <section>
                <h3>DONE</h3>
                {doneList.length ? (
                    doneList.map((t) => (
                        <TodoItem
                            key={t.id}
                            todo={t}
                            onDelete={onDelete}
                            onToggle={onToggle}
                            onUpdate={onUpdate}
                        />
                    ))
                ) : (
                    <p>완료 항목이 없습니다.</p>
                )}
            </section>
        </div>
    );
}
