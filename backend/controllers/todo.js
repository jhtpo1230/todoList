const pool = require('../db/todoListDB');

// todo 전체 조회 API : GET
exports.getTodos = async (req, res) => {
    const [todos] = await pool.query(
        'SELECT * FROM todo'
    );

    if (todos == undefined) {
        res.status(400).json();
    } else {
        res.status(200).json(todos);
    }
}

// todo 등록 API : POST
exports.createTodo = async (req, res) => {
    const { todoContent } = req.body;
    // result = [insertResult, fieldInfo]
    const [insertSQL_TodoContent] = await pool.query(
        'INSERT INTO todo (todoContent) VALUES (?)',
        [todoContent]
    );

    if (todoContent.trim() === "") {
        res.status(400).json({
            error: 'todoContent is null !!'
        });
    } else {
        res.status(201).json({
            id: insertSQL_TodoContent.insertId,
            content: todoContent,
            todoComplete: false
        });
    };
}

// todo 수정 API : UPDATE
exports.updateTodo = async (req, res) => {
    const { id } = req.params;
    const { todoContent } = req.body;
    await pool.query(
        'UPDATE todo SET todoContent = ? WHERE id = ?',
        [todoContent, id]
    );

    if (todoContent.trim() === "") {
        res.status(400).json({
            error: 'todoContent is null !!'
        });
    } else {
        res.status(200).json({
            message: `${id} 번째 todoList가 [ ${todoContent} ]로 변경되었습니다 !`
        });
    };
}

// todo 삭제 API : DELETE
exports.deleteTodo = async (req, res) => {
    const { id } = req.params;
    const [todoContent_BeforeDelete] = await pool.query(
        'SELECT todoContent FROM todo WHERE id = ?',
        [id]
    );
    await pool.query(
        'DELETE FROM todo WHERE id = ?',
        [id]
    );

    res.status(200).json({
        message: `todoList [ ${todoContent_BeforeDelete[0].todoContent} ]가 삭제되었습니다 !`
    });
}

// todo 완료 API : PATCH
exports.todoComplete = async (req, res) => {
    const { id } = req.params;
    const [selected_TodoCompleted] = await pool.query(
        'SELECT todoCompleted FROM todo WHERE id = ?',
        [id]
    );

    const currentStatus_TodoCompleted = selected_TodoCompleted[0].todoCompleted;
    const check_TodoCompleted = currentStatus_TodoCompleted === 0 ? 1 : 0;

    await pool.query(
        'UPDATE todo SET todoCompleted = ? WHERE id = ?',
        [check_TodoCompleted, id]
    );

    res.status(200).json({
        message: `todoList가 ${check_TodoCompleted === 1 ? "완료" : "미완료"}로 설정되었습니다 !`
    });
}