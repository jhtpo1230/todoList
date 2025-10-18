import { useState } from "react";
import "../styles/todo_item.css";
export default function TodoItem({ todo, onDelete, onUpdate, onToggle }) {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(todo.title);

    const handleUpdate = () => {
        if (!value.trim()) return; // 수정 후 완료 버튼을 눌렀을 때 공백이면 업데이트 안되게 하는 코드
        onUpdate(todo.id, value);
        setEditing(false);
    };

    return (
        <div className="todo-item">
            <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => onToggle(todo.id)}
            />
            {editing ? (
                <>
                    <input
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="edit-input"
                    />
                    <div className="item-buttons">
                        <button className="confirm" onClick={handleUpdate}>
                            완료
                        </button>
                        <button
                            className="cancel"
                            onClick={() => setEditing(false)}
                        >
                            취소
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <span>{todo.title}</span>
                    <div className="item-buttons">
                        <button
                            className="edit"
                            onClick={() => setEditing(true)}
                        >
                            수정
                        </button>
                        <button
                            className="delete"
                            onClick={() => onDelete(todo.id)}
                        >
                            삭제
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
