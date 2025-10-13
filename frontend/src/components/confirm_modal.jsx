import "../styles/confirm_modal.css";

export default function ConfirmModal({ onConfirm, onCancel }) {
    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <p className="modal-text">정말 삭제하시겠습니까?</p>
                <div className="modal-buttons">
                    <button className="confirm-btn" onClick={onConfirm}>
                        확인
                    </button>
                    <button className="cancel-btn" onClick={onCancel}>
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
}
