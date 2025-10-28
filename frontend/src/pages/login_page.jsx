import { useState } from "react";
// import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/login_page.css"; // 스타일 파일 따로 만들기
import { loginUser } from "../api/todo_api";

export default function LoginPage() {
    const [login_id, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    const navigate = useNavigate();

    // 로그인 버튼 클릭 시 실행
    const handleLogin = async () => {
        if (!login_id || !password) {
            setErrorMsg("아이디와 비밀번호를 확인해주세요");
            return;
        }

        try {
            const res = await loginUser(login_id, password);
            console.log("로그인 응답:", res);

            if (res.loginSuccess && res.pwSuccess) {
                alert(`${res.message}`);
                localStorage.setItem("userId", res.user_id); // 로컬에 저장
                localStorage.setItem("loginId", res.login_id); // 로그아웃 부분에 회원 정보 보여주기 위해사용
                localStorage.setItem("token", res.token); // 토큰 저장
                localStorage.setItem("lastViewPage", res.lastViewPage); //없으면 개인페이지로 감
                navigate("/todo", { state: { userId: res.user_id } });
            } //여기에 해당하지 않으면 400에러가 발생해서 바로catch로 이동함
            // } else {
            //     setErrorMsg("아이디와 비밀번호를 확인해주세요");
            //     // alert(
            //     //     // DB에 없는 아이디를 입력할 경우에는 이 코드가 실행 되지 않음
            //     //     res.message || "아이디와 비밀번호를 확인해주세요."
            //     // );
            // }
        } catch (err) {
            // 400에러가 발생할 경우에는 프론트의 try 부분을 무조건 건너뛴다
            console.error("catch 문 안으로 진입:", err);
            if (
                err.response &&
                err.response.data &&
                err.response.data.message
            ) {
                setErrorMsg("아이디와 비밀번호를 확인해주세요.");
                //alert(err.response.data.message); // 백엔드에서 온 에러 메시지 표시
            } else {
                alert("로그인 중 알 수 없는 오류가 발생했습니다.");
            }
        }
    };

    return (
        <div className="login-page">
            <h2 className="login-title">로그인</h2>
            <input
                type="text"
                placeholder="아이디를 입력해주세요."
                value={login_id}
                onChange={(e) => {
                    setUserId(e.target.value);
                    if (errorMsg) setErrorMsg("");
                }}
                className={`login-input ${errorMsg ? "input-error" : ""}`} // 에러 시 테두리 빨강
            />
            <input
                type="password"
                placeholder="비밀번호를 입력해주세요."
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMsg) setErrorMsg("");
                }}
                className={`login-input ${errorMsg ? "input-error" : ""}`} // 에러 시 테두리 빨강
            />
            {errorMsg && <p className="error-text">{errorMsg}</p>}
            <button onClick={handleLogin} className="login-btn">
                로그인
            </button>
            <button
                onClick={() => navigate("/signup")}
                className="login-signup-btn"
            >
                회원가입
            </button>
        </div>
    );
}
