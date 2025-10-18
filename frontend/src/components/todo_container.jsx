import { useState, useEffect } from "react";
import TodoInput from "./todo_input";
import TodoList from "./todo_list";
import ConfirmModal from "./confirm_modal";
import "../styles/common.css";
//api 불러오기
import {
    getTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
} from "../api/todo_api"; // 나중에 추가

export default function TodoContainer({ userId }) {
    const [todos, setTodos] = useState([]); //실제 데이터를 저장 하는 곳
    const [showModal, setShowModal] = useState(false); //모달 표시상태
    const [targetId, setTargetId] = useState(null); //삭제 대상 id 저장

    useEffect(() => {
        if (!userId) return; // userId가 없으면 실행하지 않음

        const fetchTodos = async () => {
            try {
                const data = await getTodos(userId); //  서버에서 목록 불러오기
                setTodos(data); // 응답 받은 데이터로 상태 업데이트
            } catch (err) {
                console.error("할 일 불러오기 실패:", err);
            }
        };
        fetchTodos(); // 함수 실행
    }, [userId]);

    const handleAdd = async (title) => {
        try {
            await addTodo(userId, title); //  서버에 새 todo 추가 요청
            const updated = await getTodos(userId); //  DB의 최신 상태 불러오기
            setTodos(updated); //  React 화면 업데이트
        } catch (err) {
            console.error("할 일 추가 실패:", err);
        }
    };

    const handleUpdate = async (id, value) => {
        try {
            await updateTodo(userId, id, value); // 서버에 PUT 요청
            const updated = await getTodos(userId); // 최신 목록 다시 불러오기
            setTodos(updated);
        } catch (err) {
            console.error("할 일 수정 실패:", err);
        }
    };

    const askDelete = (id) => {
        setTargetId(id);
        setShowModal(true);
    };

    const confirmDelete = async () => {
        try {
            await deleteTodo(userId, targetId);
            const updated = await getTodos(userId);
            setTodos(updated);
        } catch (err) {
            console.error("할 일 삭제 실패:", err);
        } finally {
            setShowModal(false);
            setTargetId(null);
        }
    };

    const cancelDelete = () => {
        setShowModal(false);
        setTargetId(null);
    };

    const handleToggle = async (id) => {
        try {
            await toggleComplete(userId, id); // 서버에 PATCH 요청
            const updated = await getTodos(userId); // 완료 상태 반영된 최신 목록
            setTodos(updated);
        } catch (err) {
            console.error("할 일 완료/미완료 토글 실패:", err);
        }
    };

    return (
        <div className="todo-container">
            <TodoInput onAdd={handleAdd} />
            <TodoList
                todos={todos}
                onDelete={askDelete}
                onToggle={handleToggle}
                onUpdate={handleUpdate}
            />
            {showModal && (
                <ConfirmModal
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}
        </div>
    );
}
