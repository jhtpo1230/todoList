import axios from "axios";
const BASE_URL = "http://localhost:8080/todo";

//할 일 목록 조회(모든  api가 작동할때 전부다 적용이 되어야 함)
export const getTodos = async () => {
    const res = await axios.get(BASE_URL);
    // DB 필드명(todoContent, todoCompleted)을
    // 프론트 표준(title, completed)으로 변환
    return res.data.map((t) => ({
        id: t.id,
        title: t.todoContent,
        completed: !!t.todoCompleted, // 0 → false, 1 → true
    }));
};
//할 일 등록
export const addTodo = async (todoContent) => {
    const res = await axios.post(BASE_URL, { todoContent });
    return res.data;
};
//할 일 수정(put)
export const updateTodo = async (id, todoContent) => {
    const res = await axios.put(`${BASE_URL}/${id}`, { todoContent });
    return res.data;
};
//할 일 삭제(delete)
export const deleteTodo = async (id) => {
    const res = await axios.delete(`${BASE_URL}/${id}`);
    return res.data;
};
//완료/미완료 토글 PATCH
export const toggleComplete = async (id) => {
    const res = await axios.patch(`${BASE_URL}/${id}/complete`);
    return res.data;
};
