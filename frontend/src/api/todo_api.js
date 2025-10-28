import axios from "axios";
// 공통 기본 주소
// 공통 axios 인스턴스 생성
const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL, // 서버 주소
});
// console.log("API BASE URL:", process.env.REACT_APP_API_BASE_URL);

// 모든 요청에 토큰 자동 추가
// 요청이 서버로 보내지기 직전에 실행되는 함수
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token"); //로그인 성공 시 localStorage에 저장해둔 JWT토큰을 가져온다
        console.log("요청 헤더 확인:", token ? `Bearer ${token}` : "토큰 없음");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // 헤더 요청에 JWT 추가
        }
        return config; //수정된 요청 설정을 axios로 돌려주는 것
        // 모든 api 요청이 자동으로 아래처럼 바뀌게 됨
        //         GET /users/3/todos HTTP/1.1
        //         Host: localhost:8080
        //         Authorization: Bearer eyJhbGciOiJIUzI1...
    },
    (error) => Promise.reject(error)
);

// 401 또는 403 발생 시 자동 로그아웃
// api.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (
//             error.response &&
//             (error.response.status === 401 || error.response.status === 403)
//         ) {
//             alert(
//                 "로그인이 만료되었거나 유효하지 않습니다. 다시 로그인해주세요."
//             );
//             localStorage.removeItem("token");
//             localStorage.removeItem("userId");
//             window.location.href = "/login";
//         }
//         return Promise.reject(error);
//     }
// );

// 회원가입 api
export const joinUser = async (login_id, password) => {
    const res = await api.post(`/user/join`, {
        login_id,
        password,
    });
    return res.data;
};

// 로그인 API
export const loginUser = async (login_id, password) => {
    const res = await api.post(`/user/login`, {
        login_id,
        password,
    });
    return res.data;
};

// 로그아웃 API
export const logoutUser = async (userId, lastViewPage) => {
    console.log(lastViewPage);
    const res = await api.post(`/user/logout`, {
        userId,
        lastViewPage,
    });
    return res.data;
};

//할 일 목록 조회(모든  api가 작동할때 전부다 적용이 되어야 함)
export const getTodos = async (userId) => {
    const res = await api.get(`/users/${userId}/todos`);

    // DB 필드명(todoContent, todoCompleted)을
    // 프론트 표준(title, completed)으로 변환
    return res.data.map((t) => ({
        id: t.id,
        title: t.todoContent,
        completed: !!t.todoCompleted, // 0 → false, 1 → true
    }));
};

//할 일 등록
export const addTodo = async (userId, todoContent) => {
    const res = await api.post(`/users/${userId}/todos`, {
        todoContent,
    });
    return res.data;
};
//할 일 수정(put)
export const updateTodo = async (userId, id, todoContent) => {
    const res = await api.put(`/users/${userId}/todos/${id}`, {
        todoContent,
    });
    return res.data;
};
//할 일 삭제(delete)
export const deleteTodo = async (userId, id) => {
    const res = await api.delete(`/users/${userId}/todos/${id}`);
    return res.data;
};
//완료/미완료 토글 PATCH
export const toggleComplete = async (userId, id) => {
    const res = await api.patch(`/users/${userId}/todos/${id}/complete`);
    return res.data;
};

// 팀 목록 조회
export const getTeams = async (userId) => {
    const res = await api.get(`/users/${userId}/team`);
    return res.data;
};

// 팀 생성 API
export const createTeam = async (team_name) => {
    const userId = localStorage.getItem("userId"); // ✅ 로그인한 사용자 ID 불러오기
    const res = await api.post(`/team/create`, { team_name, userId });
    return res.data;
};

// 팀 할 일 전체 조회
export const getTeamTodos = async (teamId) => {
    const res = await api.get(`/teams/${teamId}/todos`);
    const data = res.data;

    // 배열인지 확인 후 변환(비어있을때)
    if (!Array.isArray(data)) {
        console.error("Unexpected data format:", data);
        return [];
    }
    return res.data.map((t) => ({
        id: t.id,
        title: t.todoContent,
        completed: !!t.todoCompleted,
    }));
};

// 팀 할 일 추가
export const addTeamTodo = async (teamId, todoContent) => {
    const res = await api.post(`/teams/${teamId}/todos`, { todoContent });
    return res.data;
};

// 팀 할 일 수정
export const updateTeamTodo = async (teamId, id, todoContent) => {
    const res = await api.put(`/teams/${teamId}/todos/${id}`, { todoContent });
    return res.data;
};

// 팀 할 일 삭제
export const deleteTeamTodo = async (teamId, id) => {
    const res = await api.delete(`/teams/${teamId}/todos/${id}`);
    return res.data;
};

// 팀 할 일 완료 토글
export const toggleTeamTodo = async (teamId, id) => {
    const res = await api.patch(`/teams/${teamId}/todos/${id}/complete`);
    return res.data;
};

// 팀원 목록 불러오기
export const getTeamMembers = async (teamId) => {
    const res = await api.get(`/team/${teamId}`);
    return res.data;
};

// 팀원 초대
export const inviteTeamMember = async (teamId, loginId) => {
    const res = await api.post(`/team/${teamId}/invite`, { loginId });
    return res.data;
};

// 팀원 삭제
export const deleteTeamMember = async (teamId, userId) => {
    const res = await api.delete(`/team/${teamId}/delete`, {
        data: { userId },
    });
    return res.data;
};

// 팀 삭제
export const deleteTeam = async (teamId) => {
    const res = await api.delete(`/teams/${teamId}`);
    return res.data;
};
