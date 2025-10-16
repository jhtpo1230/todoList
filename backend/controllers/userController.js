const pool = require('../db/todoListDB');

// 회원가입 API : POST
exports.joinUser = async (req, res) => {
    const { login_id, password } = req.body;
    const [checkLoginIdExist] = await pool.query(
        'SELECT * FROM user WHERE login_id = ?', login_id
    );
    if (checkLoginIdExist.length > 0) {
        return res.status(400).json({
            JoinSuccess: false,
            message: "이미 존재하는 ID 입니다."
        });
    } else {
        await pool.query(
            'INSERT INTO user (login_id, password) VALUES (?, ?)',
            [login_id, password]
        );

        res.status(201).json({
            JoinSuccess: true,
            message: `${login_id} 님 회원가입을 축하드립니다.`
        })
    }
}

// 로그인 API : POST
exports.loginUser = async (req, res) => {
    const { login_id, password } = req.body;
    const [checkLoginIdExist] = await pool.query(
        'SELECT * FROM user WHERE login_id = ?', login_id
    );
    if (checkLoginIdExist.length === 0) {
        return res.status(400).json({
            loginSuccess: false,
            message: "존재하지 않는 ID 입니다."
        });
    } else {
        const [userInfo] = await pool.query(
            'SELECT login_id, password FROM user WHERE login_id=?', login_id
        );
        if (userInfo[0].password !== password) {
            res.status(400).json({
                pwSuccess: false,
                message: `비밀번호가 틀렸습니다.`
            })
        } else {
            res.status(200).json({
                JoinSuccess: true,
                pwSuccess: true,
                message: `${login_id} 님 환영합니다!`
            })
        }
    }
}