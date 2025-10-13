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

export default function TodoContainer() {
    const [todos, setTodos] = useState([]);
    const [showModal, setShowModal] = useState(false); //모달 표시상태
    const [targetId, setTargetId] = useState(null); //삭제 대상 id 저장

    useEffect(() => {
        const fetchTodos = async () => {
            try {
                const data = await getTodos(); // ✅ 서버에서 목록 불러오기
                setTodos(data); // 응답 받은 데이터로 상태 업데이트
            } catch (err) {
                console.error("할 일 불러오기 실패:", err);
            }
        };
        fetchTodos(); // 함수 실행
    }, []);

    const handleAdd = async (title) => {
        try {
            await addTodo(title); // ✅ 서버에 새 todo 추가 요청
            const updated = await getTodos(); // ✅ DB의 최신 상태 불러오기
            setTodos(updated); // ✅ React 화면 업데이트
        } catch (err) {
            console.error("할 일 추가 실패:", err);
        }
    };

    const handleUpdate = async (id, value) => {
        try {
            await updateTodo(id, value); // 서버에 PUT 요청
            const updated = await getTodos(); // 최신 목록 다시 불러오기
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
            await deleteTodo(targetId);
            const updated = await getTodos();
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
            await toggleComplete(id); // 서버에 PATCH 요청
            const updated = await getTodos(); // 완료 상태 반영된 최신 목록
            setTodos(updated);
        } catch (err) {
            console.error("할 일 완료/미완료 토글 실패:", err);
        }
    };

    // 로컬에서 사용하는 코드
    // useEffect(() => {
    //     // 나중에 백엔드 연결 시 API 호출 부분
    //     // 임시로 로컬에 기본 데이터 추가
    //     setTodos([
    //         { id: 1, title: "데브코스 강의 수강하기", completed: false },
    //         { id: 2, title: "React 구조 잡기", completed: true },
    //     ]);
    // }, []);

    // const handleAdd = (title) => {
    //     const newTodo = {
    //         id: Date.now(),
    //         title,
    //         completed: false,
    //     };
    //     setTodos([...todos, newTodo]);
    // };

    // //수정
    // const handleUpdate = (id, value) => {
    //     setTodos(
    //         todos.map((todo) =>
    //             todo.id === id ? { ...todo, title: value } : todo
    //         )
    //     );
    // };

    // //삭제 클릭 시: 모달만 띄우고 대상 id 저장
    // const askDelete = (id) => {
    //     setTargetId(id);
    //     setShowModal(true);
    // };

    // //모달 확인: 실제 삭제
    // const confirmDelete = () => {
    //     setTodos(todos.filter((t) => t.id !== targetId));
    //     setShowModal(false);
    //     setTargetId(null);
    // };

    // //모달 취소: 닫기만
    // const cancelDelete = () => {
    //     setShowModal(false);
    //     setTargetId(null);
    // };

    // const handleToggle = (id) => {
    //     setTodos(
    //         todos.map((todo) =>
    //             todo.id === id ? { ...todo, completed: !todo.completed } : todo
    //         )
    //     );
    // };

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
