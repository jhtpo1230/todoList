import { useState, useEffect } from "react";
import TodoInput from "./todo_input";
import TodoList from "./todo_list";
import ConfirmModal from "./confirm_modal";
import "../styles/common.css";
//api 불러오기
import {
    // 개인용
    getTodos,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleComplete,
    // 팀용
    getTeamTodos,
    addTeamTodo,
    updateTeamTodo,
    deleteTeamTodo,
    toggleTeamTodo,
} from "../api/todo_api"; // 나중에 추가

export default function TodoContainer({ userId, teamId }) {
    const [todos, setTodos] = useState([]); //실제 데이터를 저장 하는 곳
    const [showModal, setShowModal] = useState(false); //모달 표시상태
    const [targetId, setTargetId] = useState(null); //삭제 대상 id 저장

    useEffect(() => {
        //페이지 진입시 코드
        if (!userId && !teamId) return;

        const fetchTodos = async () => {
            try {
                const data = teamId
                    ? await getTeamTodos(teamId)
                    : await getTodos(userId);
                setTodos(data);
            } catch (err) {
                console.error("할 일 목록 불러오기 실패:", err);
            }
        };
        fetchTodos();
    }, [userId, teamId]);
    // 할 일 추가
    const handleAdd = async (title) => {
        try {
            if (teamId) {
                await addTeamTodo(teamId, title);
                const updated = await getTeamTodos(teamId);
                setTodos(updated);
            } else {
                await addTodo(userId, title);
                const updated = await getTodos(userId);
                setTodos(updated);
            }
        } catch (err) {
            console.error("할 일 추가 실패:", err);
        }
    };
    // 할 일 수정
    const handleUpdate = async (id, value) => {
        try {
            if (teamId) {
                await updateTeamTodo(teamId, id, value);
                const updated = await getTeamTodos(teamId);
                setTodos(updated);
            } else {
                await updateTodo(userId, id, value);
                const updated = await getTodos(userId);
                setTodos(updated);
            }
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
            if (teamId) {
                await deleteTeamTodo(teamId, targetId);
                const updated = await getTeamTodos(teamId);
                setTodos(updated);
            } else {
                await deleteTodo(userId, targetId);
                const updated = await getTodos(userId);
                setTodos(updated);
            }
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
            if (teamId) {
                await toggleTeamTodo(teamId, id);
                const updated = await getTeamTodos(teamId);
                setTodos(updated);
            } else {
                await toggleComplete(userId, id);
                const updated = await getTodos(userId);
                setTodos(updated);
            }
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
