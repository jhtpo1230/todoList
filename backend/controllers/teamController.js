const pool = require('../db/todoListDB');

exports.createTeam = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const { team_name } = req.body;
        
        const [checkTeamNameExist] = await pool.query(
            'SELECT * FROM team WHERE team_name = ?', [team_name]
        );
        if (checkTeamNameExist.length > 0) {
            return res.status(400).json({
                CreateSuccess: false,
                message: "이미 존재하는 Team 이름입니다."
            });
        }

        await pool.query(
            'INSERT INTO team (team_name, creater_id) VALUES (?, ?)',
            [team_name, userId]
        );

        return res.status(201).json({
            CreateSuccess: true,
            creater_id: userId,
            message: `${team_name} 이 생성되었습니다.`
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "서버 내부에 오류 발생",
            error: error.message
        })
    }
}