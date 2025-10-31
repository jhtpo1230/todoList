const pool = require('../db/todoListDB');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// 회원가입 API : GET  /users
exports.joinUser = async (req, res) => {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        const { loginId, password } = req.body;
        const [checkLoginIdExist] = await conn.query(
            'SELECT * FROM user WHERE login_id = ? FOR UPDATE', [loginId]
        );
        if (checkLoginIdExist.length > 0) {
            await conn.rollback();
            conn.release();
            return res.status(400).json({
                JoinSuccess: false,
                message: "이미 존재하는 ID 입니다."
            });
        }

        const salt = crypto.randomBytes(16).toString("base64");
        const hashedPassword = crypto
            .pbkdf2Sync(password, salt, 10000, 16, "sha512")
            .toString("base64");

        await conn.query(
            'INSERT INTO user (login_id, password, salt) VALUES (?, ?, ?)',
            [loginId, hashedPassword, salt]
        );

        await conn.commit();
        conn.release();

        return res.status(201).json({
            JoinSuccess: true,
            message: `${loginId} 님 회원가입을 축하드립니다.`
        })
    } catch (error) {
        await conn.rollback();
        conn.release();
        console.error(error);
        return res.status(500).json({
            message: "서버 내부에 오류 발생",
            error: error.message
        })
    }
}

// 로그인 API : GET  /users/login
exports.loginUser = async (req, res) => {
    try {
        const { loginId, password } = req.body;
        const [checkLoginIdExist] = await pool.query(
            `SELECT user_id AS userId, login_id AS loginId, password AS hashedPassword, salt, lastViewPage 
            FROM user WHERE login_id = ?`,
            [loginId]
        );

        if (checkLoginIdExist.length === 0) {
            return res.status(400).json({
                loginSuccess: false,
                message: "존재하지 않는 ID 입니다."
            });
        };

        const { userId, hashedPassword, salt, lastViewPage } = checkLoginIdExist[0];

        const InputPassword = crypto
            .pbkdf2Sync(password, salt, 10000, 16, "sha512")
            .toString("base64");

        if (InputPassword !== hashedPassword) {
            return res.status(401).json({
                pwSuccess: false,
                message: "비밀번호가 일치하지 않습니다."
            });
        } else {
            const token = jwt.sign({
                userId: userId,
                loginId: loginId
            },
                process.env.JWT_Token, {
                expiresIn: "5h",
                issuer: "KJC"
            });

            let setLastViewPage = 0;

            if (lastViewPage !== 0) {
                const [userTeamIsEXist] = await pool.query( // lastViewPage가 팀이고 팀이 있으면
                    `SELECT lastViewPage FROM user u JOIN user_team ut 
                    ON u.lastViewPage = ut.team_id AND u.user_id = ut.user_id
                    WHERE u.user_id = ?`,
                    [userId]
                );

                if (userTeamIsEXist.length > 0) {
                    setLastViewPage = lastViewPage;
                }
            }
            console.log(token);
            return res.status(200).json({
                loginSuccess: true,
                pwSuccess: true,
                userId: userId,
                loginId: loginId,
                lastViewPage: setLastViewPage,
                token: token,
                message: `${loginId} 님 환영합니다!`
            })
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "서버 내부에 오류 발생"
        })
    }
}

// 로그아웃 API : GET  /users/logout
exports.logoutUser = async (req, res) => {
    try {
        const { userId, lastViewPage } = req.body;
        const setLastViewPage = lastViewPage ?? 0;
        await pool.query(
            "UPDATE user SET lastViewPage = ? WHERE user_id = ?",
            [setLastViewPage, userId]
        );

        return res.status(200).json({
            message: `로그아웃 되었습니다!`
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "서버 내부에 오류 발생"
        })
    }
}

// 유저가 가진 팀 전체 조회 API : GET  /users/team
exports.getTeams = async (req, res) => {
    try {
        const userId = req.user.userId;
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