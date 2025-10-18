import axios from "axios";
// 공통 기본 주소
const BASE_URL = "http://localhost:8080";

// 회원가입 api
export const joinUser = async (login_id, password) => {
    const res = await axios.post(`${BASE_URL}/user/join`, {
        login_id,
        password,
    });
    return res.data;
};

// 로그인 API
export const loginUser = async (login_id, password) => {
    const res = await axios.post(`${BASE_URL}/user/login`, {
        login_id,
        password,
    });
    return res.data;
};

//할 일 목록 조회(모든  api가 작동할때 전부다 적용이 되어야 함)
export const getTodos = async (userId) => {
    const res = await axios.get(`${BASE_URL}/users/${userId}/todos`);

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
    const res = await axios.post(`${BASE_URL}/users/${userId}/todos`, {
        todoContent,
    });
    return res.data;
};
//할 일 수정(put)
export const updateTodo = async (userId, id, todoContent) => {
    const res = await axios.put(`${BASE_URL}/users/${userId}/todos/${id}`, {
        todoContent,
    });
    return res.data;
};
//할 일 삭제(delete)
export const deleteTodo = async (userId, id) => {
    const res = await axios.delete(`${BASE_URL}/users/${userId}/todos/${id}`);
    return res.data;
};
//완료/미완료 토글 PATCH
export const toggleComplete = async (userId, id) => {
    const res = await axios.patch(
        `${BASE_URL}/users/${userId}/todos/${id}/complete`
    );
    return res.data;
};
