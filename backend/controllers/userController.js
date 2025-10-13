const pool = require('../db/todoListDB');

// 회원가입 API : POST
exports.joinUser = async (req, res) => {
    const { login_id, password } = req.body;
    const [checkUserExist] = await pool.query(
        'SELECT * FROM user WHERE login_id = ?', login_id
    );
    if (checkUserExist.length > 0) {
        return res.status(400).json({
            message: "이미 존재하는 ID 입니다."
        });
    } else {
        await pool.query(
            'INSERT INTO user (login_id, password) VALUES (?, ?)',
            [login_id, password]
        );

        res.status(201).json({
            message : `${login_id} 님 회원가입을 축하드립니다.`
        })
    }
}

// 로그인 API : POST