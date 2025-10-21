const jwt = require("jsonwebtoken");
require('dotenv').config();

exports.verifyToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer 뒤의 토큰 부분

    if (!token) return res.status(401).json({ message: "로그인이 필요합니다." });

    try {
        const decoded = jwt.verify(token, process.env.JWT_Token);
        req.user = decoded; // 이후 req.user.user_id로 접근 가능
        next();
    } catch (err) {
        console.error(error);
        return res.status(403).json({ message: "유효하지 않은 토큰입니다." });
    }
};
