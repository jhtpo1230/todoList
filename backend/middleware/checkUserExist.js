const pool = require('../db/todoListDB');

exports.checkUserExist = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const [user] = await pool.query(
            'SELECT * FROM user WHERE user_id = ?', [userId]
        );

        if (user.length === 0) {
            return res.status(404).json({
                message : "존재하지 않는 user 입니다"
            })
        } else next();
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message : "서버 내부에 오류가 발생했습니다."
        })
    }
}