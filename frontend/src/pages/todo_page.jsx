import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/sidebar";
import TodoContainer from "../components/todo_container";

export default function TodoPage() {
    //로그인 하지 않은 사용자가 /todo에 접근하면 자동으로
    //로그인이 필요하다고 alert를 띄우고 로그인 페이지로 이동함
    const navigate = useNavigate();
    const location = useLocation(); // navigate로 전달된 state 접근용
    const userId = location.state?.userId; // 전달된 userId 받기
    useEffect(() => {
        // 로그인 체크
        if (!userId) {
            alert("로그인이 필요합니다!");
            navigate("/login");
        }
    }, [userId, navigate]);

    // 로그아웃 함수 추가
    const handleLogout = () => {
        localStorage.removeItem("userId"); // 저장된 로그인 정보 삭제
        localStorage.removeItem("token");
        alert("로그아웃 되었습니다.");
        navigate("/login"); // 로그인 페이지로 이동
    };

    return (
        <div className="todo-page">
            <Sidebar />
            <TodoContainer userId={userId} />
            <button
                onClick={handleLogout}
                style={{
                    backgroundColor: "#222",
                    color: "white",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    cursor: "pointer",
                }}
            >
                로그아웃
            </button>
        </div>
    );
}
