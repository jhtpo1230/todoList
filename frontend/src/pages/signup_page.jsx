import { useState } from "react";
//import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/signup_page.css";
import { joinUser } from "../api/todo_api";

export default function SignupPage() {
    const [login_id, setLoginId] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSignup = async () => {
        if (!login_id || !password) {
            alert("아이디와 비밀번호를 모두 입력해주세요.");
            return;
        }
        try {
            const res = await joinUser(login_id, password);
            console.log("회원가입 응답:", res);
            if (res.JoinSuccess) {
                alert(res.message);
                navigate("/login");
            } else {
                alert("이미 존재하는 ID 입니다.");
            }
        } catch (err) {
            console.error("회원가입 실패:", err);
            alert("회원가입 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="signup-page">
            <h2 className="signup-title">회원가입</h2>

            <input
                type="text"
                placeholder="아이디를 입력해주세요."
                value={login_id}
                onChange={(e) => setLoginId(e.target.value)}
                className="signup-input"
            />
            <input
                type="password"
                placeholder="비밀번호를 입력해주세요."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="signup-input"
            />

            <button onClick={handleSignup} className="signup-btn">
                회원가입
            </button>
            <button onClick={() => navigate("/")} className="login-btn">
                로그인으로 돌아가기
            </button>
        </div>
    );
}
