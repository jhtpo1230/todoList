import { useState } from "react";
import "../styles/todo_input.css";
export default function TodoInput({ onAdd }) {
    const [value, setValue] = useState("");

    const handleAdd = () => {
        if (!value.trim()) return;
        onAdd(value);
        setValue("");
    };

    return (
        <div className="todo-input">
            <input
                type="text"
                placeholder="할 일을 입력해주세요."
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            <button onClick={handleAdd}>등록하기</button>
        </div>
    );
}
