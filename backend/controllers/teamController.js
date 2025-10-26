const pool = require('../db/todoListDB');

exports.createTeam = async (req, res) => {
    try {
        const { team_name, userId } = req.body;
        // const userId = req.user.user_id;

        const [checkTeamNameExist] = await pool.query(
            'SELECT * FROM team WHERE team_name = ?', [team_name]
        );
        if (checkTeamNameExist.length > 0) {
            return res.status(400).json({
                CreateSuccess: false,
                message: "이미 존재하는 Team 이름입니다."
            });
        }
        const [teamResult] = await pool.query(
            'INSERT INTO team (team_name, creater_id) VALUES (?, ?)',
            [team_name, userId]
        );

        const teamId = teamResult.insertId;
        await pool.query(
            'INSERT INTO user_team (team_id, user_id) VALUES (?, ?)',
            [teamId, userId]
        );

        return res.status(201).json({
            CreateSuccess: true,
            team_id: teamId,
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

// 팀원 목록 조회
exports.getTeamMembers = async (req, res) => {
    try {
        const { teamId } = req.params;

        const [teamMembers] = await pool.query(
            `SELECT ut.user_id, u.login_id, ut.team_id 
            FROM user_team ut JOIN user u ON ut.user_id = u.user_id 
            WHERE ut.team_id = ?`,
            [teamId]
        );

        return res.status(200).json(teamMembers);

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "서버 내부에 오류 발생",
            error: error.message
        });
    }
};

exports.inviteTeamMember = async (req, res) => {
    try {
        const { teamId } = req.params;
        const { loginId } = req.body;

        const [checkLoginIdExist] = await pool.query(
            'SELECT * FROM user WHERE login_id = ?', [loginId]
        );
        if (checkLoginIdExist.length === 0) {
            return res.status(400).json({
                inviteSuccess: false,
                message: "초대하려는 유저가 존재하지 않습니다."
            });
        };

        const [checkUserExistInTeam] = await pool.query(
            'SELECT * FROM user_team WHERE user_id = ? AND team_id = ?',
            [checkLoginIdExist[0].user_id, teamId]
        );
        if (checkUserExistInTeam.length > 0) {
            return res.status(400).json({
                inviteSuccess: false,
                message: `${loginId}는 이미 팀에 가입된 사용자입니다.`
            });
        }

        // const [checkUserIsCreater] = await pool.query(
        //     'SELECT * FROM team WHERE creater_id = ? AND id = ?',
        //     [checkLoginIdExist[0].user_id, teamId]
        // );
        // if (checkUserIsCreater.length > 0) {
        //     return res.status(400).json({
        //         inviteSuccess: false,
        //         message: `${loginId}는 팀의 생성자입니다.`
        //     });
        // }

        await pool.query(
            'INSERT INTO user_team (user_id, team_id) VALUES (?, ?)',
            [checkLoginIdExist[0].user_id, teamId]
        );

        return res.status(201).json({
            inviteSuccess: true,
            message: `${loginId} 님을 팀으로 초대했습니다.`
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "서버 내부에 오류 발생",
            error: error.message
        })
    }
}

exports.deleteTeamMember = async (req, res) => {
    try {
        const { teamId } = req.params;
        const { userId } = req.body;

        const [teamHasOnlyOneUser] = await pool.query(
            `SELECT COUNT(*) AS count FROM user_team WHERE team_id = ?`,
            [teamId]
        )

        if (teamHasOnlyOneUser[0].count === 1) {
            return res.status(403).json({
                deleteSuccess: false,
                message: `팀에는 적어도 1명 이상의 팀원이 존재해야 합니다.`
            })
        }

        await pool.query(
            'DELETE FROM user_team WHERE user_id = ? AND team_id = ?',
            [userId, teamId]
        )

        return res.status(201).json({
            deleteSuccess: true,
            message: `팀에서 삭제되었습니다.`
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "서버 내부에 오류 발생",
            error: error.message
        })
    }
}