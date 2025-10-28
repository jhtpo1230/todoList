const pool = require('../db/todoListDB');

// todo 전체 조회 API : GET /users/:userId/todos
exports.getTodos = async (req, res) => {
    try {
        const { userId } = req.params;
        // const userId = req.user.userId;

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

// todo 등록 API : POST /users/:userId/todos
exports.createTodo = async (req, res) => {
    try {
        const { userId } = req.params;
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

// todo 수정 API : UPDATE /users/:userId/todos/:id
exports.updateTodo = async (req, res) => {
    try {
        const { userId, id } = req.params;
        const { todoContent } = req.body;

        if (todoContent.trim() === "") {
            return res.status(400).json({
                error: 'todoContent is empty !!'
            });
        }

        await pool.query(
            'UPDATE userTodo SET todoContent = ? WHERE user_id = ? AND id = ?',
            [todoContent, userId, id]
        );

        return res.status(200).json({
            message: `${userId}의 ${id} 번째 todoList가 [ ${todoContent} ]로 변경되었습니다 !`
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "서버 내부에 오류 발생",
            error: error.message
        });
    }
}

// todo 삭제 API : DELETE /users/:userId/todos/:id
exports.deleteTodo = async (req, res) => {
    try {
        const { userId, id } = req.params;
        const [todoContent_BeforeDelete] = await pool.query(
            'SELECT todoContent FROM userTodo WHERE user_id = ? AND id = ?',
            [userId, id]
        );
        if (todoContent_BeforeDelete.length === 0) {
            return res.status(404).json({
                message: "해당 유저에게 등록된 todo가 없습니다."
            });
        }
        await pool.query(
            'DELETE FROM userTodo WHERE user_id = ? AND id = ?',
            [userId, id]
        );

        return res.status(200).json({
            message: `todoList [ ${todoContent_BeforeDelete[0].todoContent} ]가 삭제되었습니다 !`
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "서버 내부에 오류 발생",
            error: error.message
        })
    }
}

// todo 완료 API : PATCH /users/:userId/todos/:id/complete
exports.todoComplete = async (req, res) => {
    try {
        const { userId, id } = req.params;
        const [selected_TodoCompleted] = await pool.query(
            'SELECT todoCompleted FROM userTodo WHERE user_id = ? AND id = ?',
            [userId, id]
        );

        if (selected_TodoCompleted.length === 0) {
            return res.status(404).json({
                message: "해당 유저에게 해당되는 todo가 없습니다."
            });
        }

        const currentStatus_TodoCompleted = selected_TodoCompleted[0].todoCompleted;
        const check_TodoCompleted = currentStatus_TodoCompleted === 0 ? 1 : 0;

        await pool.query(
            'UPDATE userTodo SET todoCompleted = ? WHERE user_id =? AND id = ?',
            [check_TodoCompleted, userId, id]
        );

        return res.status(200).json({
            message: `todoList가 ${check_TodoCompleted === 1 ? "완료" : "미완료"}로 설정되었습니다 !`
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "서버 내부에 오류 발생",
            error: error.message
        });
    }
}

// 유저가 가진 팀 전체 조회 API : GET  /users/:userId/team
exports.getTeams = async (req, res) => {
    try {
        const { userId } = req.params;
        // const { userId } = req.user.user_id;
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