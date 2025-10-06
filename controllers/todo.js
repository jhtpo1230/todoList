const pool = require('../db/todoListDB');

// todo 등록 API : POST
exports.createTodo = async (req, res) => {
    const { todoContent } = req.body;
    // result = [insertResult, fieldInfo]
    const [insertSQL_TodoContent] = await pool.query(
        'INSERT INTO todo (todoContent) VALUES (?)',
        [todoContent]
    );

    if (todoContent) {
        res.status(201).json({
            id: insertSQL_TodoContent.insertId,
            content: todoContent,
            todoComplete: false
        })
    } else {
        res.status(400).json({
            error: 'todoContent is undefined !!'
        });
    }
}

// todo 수정 API : UPDATE
exports.updateTodo = async (req, res) => {
    const { id } = req.params;
    const { todoContent } = req.body;
    const [updateSQL_TodoContent] = await pool.query(
        'UPDATE todo SET todoContent = ? WHERE id = ?',
        [todoContent, id]
    );

    if (todoContent.trim() === "") {
        res.status(400).json({
            error: 'todoContent is null !!'
        });
    } else {
        res.status(201).json({
            message : `${id} 번째 todoList가 [ ${todoContent} ]로 변경되었습니다 !`
        })
    }
}

// todo 삭제 API : DELETE

// todo 완료 API : FATCH

