import React from "react";
import "../styles/team_modal.css"; // 기존 팀 모달 스타일 재사용 가능
import { deleteTeam } from "../api/todo_api";

export default function TeamDeleteModal({ teamId, onClose, onDeleted }) {
    const handleDelete = async () => {
        try {
            await deleteTeam(teamId);
            alert("팀이 삭제되었습니다.");
            //onDeleted(); // Sidebar로 알려서 팀 목록 갱신
            if (onDeleted) await onDeleted();
            if (onClose) onClose(); // 모달 닫기
        } catch (err) {
            console.error("팀 삭제 실패:", err);
            alert("팀 삭제 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <h3 className="modal-title">팀 삭제</h3>
                <p className="modal-text">
                    정말 이 팀을 삭제하시겠습니까?
                    <br />
                    삭제 후에는 복구할 수 없습니다.
                </p>

                <div className="modal-btn-group">
                    <button className="modal-btn cancel" onClick={onClose}>
                        취소
                    </button>
                    <button className="modal-btn delete" onClick={handleDelete}>
                        삭제
                    </button>
                </div>
            </div>
        </div>
    );
}
