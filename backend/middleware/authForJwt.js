const jwt = require("jsonwebtoken");
const pool = require('../db/todoListDB');
require('dotenv').config();

exports.verifyToken = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; 

    if (!token)
        return res.status(401).json({
            message: "로그인이 필요합니다."
        });

    try {
        const decoded = jwt.verify(token, process.env.JWT_Token);
        req.user = decoded;

        next();
    } catch (err) {
        console.error(err);
        return res.status(403).json({
            message: "유효하지 않은 토큰입니다.",
            error: err.message
        });
    }
};
