const pool = require('../db/todoListDB');

// todo 전체 조회 API : GET /teams/:teamId/todos
exports.getTodos = async (req, res) => {
    try {
        const { teamId } = req.params;

        const [todos] = await pool.query(
            'SELECT * FROM teamTodo WHERE team_id = ?',
            [teamId]
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

// todo 등록 API : POST /teams/:teamId/todos
exports.createTodo = async (req, res) => {
    try {
        const { teamId } = req.params;
        const { todoContent } = req.body;

        if (todoContent.trim() === "") {
            return res.status(400).json({
                error: 'todoContent is empty !!'
            });
        }
        const [insertSQL_TodoContent] = await pool.query(
            'INSERT INTO teamTodo (team_id, todoContent) VALUES (?, ?)',
            [teamId, todoContent]
        );

        return res.status(201).json({
            id: insertSQL_TodoContent.insertId,
            team_id: teamId,
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

// todo 수정 API : UPDATE /teams/:teamId/todos/:id
exports.updateTodo = async (req, res) => {
    try {
        const { teamId, id } = req.params;
        const { todoContent } = req.body;

        if (todoContent.trim() === "") {
            return res.status(400).json({
                error: 'todoContent is empty !!'
            });
        }

        await pool.query(
            'UPDATE teamTodo SET todoContent = ? WHERE team_id = ? AND id = ?',
            [todoContent, teamId, id]
        );

        return res.status(200).json({
            message: `todoList가 ${todoContent} 로 변경되었습니다 !`
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "서버 내부에 오류 발생",
            error: error.message
        });
    }
}

// todo 삭제 API : DELETE /teams/:teamId/todos/:id
exports.deleteTodo = async (req, res) => {
    try {
        const { teamId, id } = req.params;
        const [todoContent_BeforeDelete] = await pool.query(
            'SELECT todoContent FROM teamTodo WHERE team_id = ? AND id = ?',
            [teamId, id]
        );
        if (todoContent_BeforeDelete.length === 0) {
            return res.status(404).json({
                message: "팀에게 해당하는 todo가 없습니다."
            });
        }
        await pool.query(
            'DELETE FROM teamTodo WHERE team_id = ? AND id = ?',
            [teamId, id]
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

// todo 완료 API : PATCH /teams/:teamId/todos/:id/complete
exports.todoComplete = async (req, res) => {
    try {
        const { teamId, id } = req.params;
        const [selected_TodoCompleted] = await pool.query(
            'SELECT todoCompleted FROM teamTodo WHERE team_id = ? AND id = ?',
            [teamId, id]
        );

        if (selected_TodoCompleted.length === 0) {
            return res.status(404).json({
                message: "팀에게 해당하는 todo가 없습니다."
            });
        }

        const currentStatus_TodoCompleted = selected_TodoCompleted[0].todoCompleted;
        const check_TodoCompleted = currentStatus_TodoCompleted === 0 ? 1 : 0;

        await pool.query(
            'UPDATE teamTodo SET todoCompleted = ? WHERE team_id =? AND id = ?',
            [check_TodoCompleted, teamId, id]
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

// 팀 삭제 API : DELETE /teams/:teamId
exports.deleteTeam = async (req, res) => {
    try {
        const { teamId } = req.params;

        await pool.query(
            'DELETE FROM team WHERE id = ?',
            [teamId]
        );

        return res.status(200).json({
            message : "팀이 삭제되었습니다.",
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "서버 내부에 오류 발생",
            error: error.message
        });
    }
};