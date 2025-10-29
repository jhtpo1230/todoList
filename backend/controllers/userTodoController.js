const pool = require('../db/todoListDB');

const TodoStatus = Object.freeze({
    PENDING: 'PENDING',
    COMPLETED: 'COMPLETED'
});

// todo 전체 조회 API : GET /todos
exports.getTodos = async (req, res) => {
    try {
        const userId = req.user.userId;

        const [todos] = await pool.query(
            'SELECT * FROM userTodo WHERE user_id = ?',
            [userId]
        );

        return res.status(200).json(todos);

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "서버 내부에 오류 발생",
            error: error.message
        });
    }
};

// todo 등록 API : POST /users/todos
exports.createTodo = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { todoContent } = req.body;

        if (todoContent.trim() === "") {
            return res.status(400).json({
                error: 'todoContent is empty !!'
            });
        }

        const [insertSQL_TodoContent] = await pool.query(
            'INSERT INTO userTodo (user_id, todoContent) VALUES (?, ?)',
            [userId, todoContent]
        );

        return res.status(201).json({
            id: insertSQL_TodoContent.insertId,
            user_id: userId,
            content: todoContent,
            todoComplete: false
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "서버 내부에 오류 발생",
            error: error.message
        })
    }
}

// todo 수정 API : UPDATE /users/todos/:id
exports.updateTodo = async (req, res) => {
    try {
        const id = req.params.id;
        const { todoContent, selectedTodoCompleted } = req.body;

        if (todoContent.trim() === "") {
            return res.status(400).json({
                error: 'todoContent is empty !!'
            });
        }

        if (!Object.values(TodoStatus).includes(selectedTodoCompleted)) {
            return res.status(400).json({
                error: 'todoCompleted Must be PENDING or COMPLETED.'
            });
        }

        await pool.query(
            'UPDATE userTodo SET todoContent = ?, todoCompleted =? WHERE  id = ?',
            [todoContent, selectedTodoCompleted, id]
        );

        return res.status(200).json({
            message: `${id} 번째 todoList가 [ ${todoContent} / ${selectedTodoCompleted} ]로 변경되었습니다 !`
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "서버 내부에 오류 발생",
            error: error.message
        });
    }
}

// todo 삭제 API : DELETE /users/todos/:id
exports.deleteTodo = async (req, res) => {
    try {
        const id = req.params.id;
        const [todoContentBeforeDelete] = await pool.query(
            'SELECT todoContent FROM userTodo WHERE id = ?',
            [id]
        );
        if (todoContentBeforeDelete.length === 0) {
            return res.status(404).json({
                message: "해당 유저에게 등록된 todo가 없습니다."
            });
        }
        await pool.query(
            'DELETE FROM userTodo WHERE id = ?',
            [id]
        );

        return res.status(200).json({
            message: `todoList [ ${todoContentBeforeDelete[0].todoContent} ]가 삭제되었습니다 !`
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "서버 내부에 오류 발생",
            error: error.message
        })
    }
}

// 유저가 가진 팀 전체 조회 API : GET  /team
exports.getTeams = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const [teams] = await pool.query(
            `SELECT t.team_name, t.creater_id, ut.user_id, ut.team_id 
            FROM team t JOIN user_team ut ON t.id = ut.team_id 
            WHERE user_id = ?`,
            [userId]
        );

        return res.status(200).json(teams);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "서버 내부에 오류 발생",
            error: error.message
        });
    }
}