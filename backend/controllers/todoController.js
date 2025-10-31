const pool = require('../db/todoListDB');

const TodoStatus = Object.freeze({
    PENDING: 'PENDING',
    COMPLETED: 'COMPLETED'
});

// todo 전체 조회 API : GET /todos
exports.getTodos = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { teamId } = req.query;
        let todos;

        if (!teamId || Number(teamId) === 0) {
            [todos] = await pool.query(
                'SELECT * FROM todo WHERE user_id = ? AND team_id = 0',
                userId,
            );
        } else {
            [todos] = await pool.query(
                'SELECT * FROM todo WHERE team_id = ?',
                [teamId]
            );
        }

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
        const userId = req.user.userId;
        const { teamId } = req.query;
        const { todoContent } = req.body;

        if (todoContent.trim() === "") {
            return res.status(400).json({
                error: 'todoContent is empty !!'
            });
        }
        let insertTodoContent;
        if (!teamId || Number(teamId) === 0) {
            [insertTodoContent] = await pool.query(
                'INSERT INTO todo (user_id, team_id, todoContent) VALUES (?, 0, ?)',
                [userId, todoContent]
            );
        } else {
            [insertTodoContent] = await pool.query(
                'INSERT INTO todo (user_id, team_id, todoContent) VALUES (?, ?, ?)',
                [userId, teamId, todoContent]
            );
        }

        return res.status(201).json({
            todoId: insertTodoContent.insertId,
            userId: userId,
            teamId : teamId,
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

// todo 수정 API : UPDATE /users/todos/:todoId
exports.updateTodo = async (req, res) => {
    try {
        const todoId = req.params.todoId;
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
            'UPDATE todo SET todoContent = ?, todoCompleted =? WHERE id = ?',
            [todoContent, selectedTodoCompleted, todoId]
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

// todo 삭제 API : DELETE /users/todos/:todoId
exports.deleteTodo = async (req, res) => {
    try {
        const todoId = req.params.todoId;
        const [todoContentBeforeDelete] = await pool.query(
            'SELECT todoContent FROM todo WHERE id = ?',
            [todoId]
        );
        if (todoContentBeforeDelete.length === 0) {
            return res.status(404).json({
                message: "해당 todo가 존재하지 않습니다."
            });
        }
        await pool.query(
            'DELETE FROM todo WHERE id = ?',
            [todoId]
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