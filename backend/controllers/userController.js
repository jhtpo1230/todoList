const pool = require('../db/todoListDB');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.joinUser = async (req, res) => {
    try {
        const { login_id, password } = req.body;
        const [checkLoginIdExist] = await pool.query(
            'SELECT * FROM user WHERE login_id = ?', [login_id]
        );
        if (checkLoginIdExist.length > 0) {
            return res.status(400).json({
                JoinSuccess: false,
                message: "이미 존재하는 ID 입니다."
            });
        }

        const salt = crypto.randomBytes(16).toString("base64");
        const hashedPassword = crypto
            .pbkdf2Sync(password, salt, 10000, 16, "sha512")
            .toString("base64");

        await pool.query(
            'INSERT INTO user (login_id, password, salt) VALUES (?, ?, ?)',
            [login_id, hashedPassword, salt]
        );

        return res.status(201).json({
            JoinSuccess: true,
            message: `${login_id} 님 회원가입을 축하드립니다.`
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "서버 내부에 오류 발생",
            error: error.message
        })
    }
}

exports.loginUser = async (req, res) => {
    try {
        const { login_id, password } = req.body;
        const [checkLoginIdExist] = await pool.query(
            'SELECT * FROM user WHERE login_id = ?', [login_id]
        );

        if (checkLoginIdExist.length === 0) {
            return res.status(400).json({
                loginSuccess: false,
                message: "존재하지 않는 ID 입니다."
            });
        };

        const { salt, password: HashedPassword, user_id } = checkLoginIdExist[0];

        const InputPassword = crypto
            .pbkdf2Sync(password, salt, 10000, 16, "sha512")
            .toString("base64");

        if (InputPassword !== HashedPassword) {
            return res.status(401).json({
                pwSuccess: false,
                message: "비밀번호가 일치하지 않습니다."
            });
        } else {
            const token = jwt.sign({
                user_id: user_id,
                login_id: login_id
            },
                process.env.JWT_Token, {
                expiresIn: "2h",
                issuer: "KJC"
            });

            return res.status(200).json({
                loginSuccess: true,
                pwSuccess: true,
                user_id: user_id,
                login_id: login_id,
                token: token,
                message: `${login_id} 님 환영합니다!`
            })
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "서버 내부에 오류 발생"
        })
    }
}