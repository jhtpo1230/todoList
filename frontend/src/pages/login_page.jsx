import { useState } from "react";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/login_page.css"; // 스타일 파일 따로 만들기
import { loginUser } from "../api/todo_api";

export default function LoginPage() {
    const [login_id, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    // 로그인 버튼 클릭 시 실행
    const handleLogin = async () => {
        if (!login_id || !password) {
            alert("아이디와 비밀번호를 입력해주세요.");
            return;
        }

        try {
            const res = await loginUser(login_id, password);
            console.log("로그인 응답:", res);

            if (res.loginSuccess && res.pwSuccess) {
                alert(`${res.message}`);
                localStorage.setItem("userId", res.user_id); // 로컬에 저장
                localStorage.setItem("token", res.token); // 토큰 저장
                navigate("/todo", { state: { userId: res.user_id } });
            } else {
                alert("아이디 또는 비밀번호가 올바르지 않습니다.");
            }
        } catch (err) {
            console.error("로그인 실패:", err);
        }
    };

    return (
        <div className="login-page">
            <h2 className="login-title">로그인</h2>
            <input
                type="text"
                placeholder="아이디를 입력해주세요."
                value={login_id}
                onChange={(e) => setUserId(e.target.value)}
                className="login-input"
            />
            <input
                type="password"
                placeholder="비밀번호를 입력해주세요."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
            />
            <button onClick={handleLogin} className="login-btn">
                로그인
            </button>
            <button onClick={() => navigate("/signup")} className="signup-btn">
                회원가입
            </button>
        </div>
    );
}
