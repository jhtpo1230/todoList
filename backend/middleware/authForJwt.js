const jwt = require("jsonwebtoken");
const pool = require('../db/todoListDB');
require('dotenv').config();

exports.verifyToken = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer 뒤의 토큰 부분

    if (!token)
        return res.status(401).json({
            message: "로그인이 필요합니다."
        });

    try {
        const decoded = jwt.verify(token, process.env.JWT_Token);
        req.user = decoded;

        next();
        // const userId = req.user.user_id;
        // const [user] = await pool.query(
        //     'SELECT * FROM user WHERE user_id = ?', [userId]
        // );
        // if (user.length === 0) {
        //     return res.status(404).json({
        //         message: "존재하지 않는 user 입니다"
        //     })
        // } 
        
        // else next();
    } catch (err) {
        console.error(err);
        return res.status(403).json({
            message: "유효하지 않은 토큰입니다.",
            error: err.message
        });
    }
};
