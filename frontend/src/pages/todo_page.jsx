import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";
import TodoContainer from "../components/todo_container";
import "../styles/todo_page.css"; //임시로 추가
//팀페이지가 클릭되었을 때 팀페이지로 랜더링되게 import함
// import TeamCreatePage from "../components/TeamCreatePage";

export default function TodoPage() {
    //로그인 하지 않은 사용자가 /todo에 접근하면 자동으로
    //로그인이 필요하다고 alert를 띄우고 로그인 페이지로 이동함
    const navigate = useNavigate();
    const [teamId, setTeamId] = useState(
        Number(localStorage.getItem("lastViewPage")) || 0
    ); //0=개인페이지
    const userId = localStorage.getItem("userId"); // 전달된 userId 받기
    useEffect(() => {
        // 로그인 체크
        if (!userId) {
            alert("로그인이 필요합니다!");
            navigate("/login");
        }
    }, [userId, navigate]);

    // Sidebar에서 팀 선택 시 실행될 함수
    const handleSelect = (view) => {
        if (view === "personal") {
            setTeamId(0);
            localStorage.setItem("lastViewPage", 0);
        } else if (view.startsWith("team-")) {
            const id = Number(view.split("-")[1]);
            setTeamId(id);
            localStorage.setItem("lastViewPage", id);
        }
    };

    return (
        <div className="todo-page">
            <Sidebar onSelect={handleSelect} setTeamId={setTeamId} />
            <TodoContainer userId={userId} teamId={teamId} />
            {/* 위의 부분에서 전달 인자 수정 setTeamId={setTeamId}*/}
        </div>
    );
}
