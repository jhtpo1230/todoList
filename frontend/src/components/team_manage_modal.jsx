import React, { useState, useEffect } from "react";
import {
    getTeamMembers,
    inviteTeamMember,
    deleteTeamMember,
} from "../api/todo_api";
import "../styles/team_modal.css";

export default function TeamCreateModal({ teamId, onClose }) {
    const [members, setMembers] = useState([]);
    const [inviteId, setInviteId] = useState("");

    useEffect(() => {
        if (teamId) {
            console.log("📌 [TeamCreateModal] teamId:", teamId);
            loadMembers();
        }
    }, [teamId]);

    const loadMembers = async () => {
        if (!teamId) return; // ✅ teamId가 없으면 API 호출 안 함
        try {
            const data = await getTeamMembers(teamId);
            setMembers(data);
        } catch (err) {
            console.error("팀원 목록 불러오기 실패:", err);
        }
    };

    const handleInvite = async () => {
        const res = await inviteTeamMember(teamId, inviteId);
        alert(res.message);
        if (res.inviteSuccess) loadMembers();
    };

    const handleDelete = async (userId) => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;
        const res = await deleteTeamMember(teamId, userId);
        alert(res.message);
        if (res.deleteSuccess) loadMembers();
    };

    // 기존 전체 구조를 modal-overlay/modal-box 구조로 감쌈
    return (
        <div className="modal-overlay" onClick={onClose}>
            {" "}
            {/* 변경됨: 모달 배경 */}
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                {" "}
                {/* 변경됨: 모달 박스 */}
                <h3>팀원 관리</h3> {/* h2 → h3로 변경 (공통 스타일에 맞춤) */}
                <div className="member-list">
                    {members.length === 0 ? ( // ✅ 변경됨: 빈 목록 처리 추가
                        <p>아직 팀원이 없습니다.</p>
                    ) : (
                        members.map((m) => (
                            // 기존 m.userId → m.user_id (DB 컬럼명에 맞게)
                            <div key={m.user_id} className="member-item">
                                <span>{m.login_id}</span>
                                {/* 버튼에 스타일 클래스 추가 */}
                                <button
                                    className="btn-secondary"
                                    onClick={() => handleDelete(m.user_id)}
                                >
                                    🗑️
                                </button>
                            </div>
                        ))
                    )}
                </div>
                {/* 초대 입력칸 위치 변경 (modal-box 내부 하단으로 이동) */}
                <input
                    type="text"
                    placeholder="초대할 아이디 입력"
                    value={inviteId}
                    onChange={(e) => setInviteId(e.target.value)}
                />
                {/* 버튼 그룹을 modal-buttons로 묶음 */}
                <div className="modal-buttons">
                    <button className="btn-primary" onClick={handleInvite}>
                        초대
                    </button>
                    <button className="btn-secondary" onClick={onClose}>
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
}
