import "../styles/confirm_modal.css";
export default function ConfirmModal({ onConfirm, onCancel }) {
    return (
        <div className="modal-backdrop">
            <div className="modal">
                <p>정말 삭제하시겠습니까?</p>
                <div className="buttons">
                    <button onClick={onConfirm}>확인</button>
                    <button onClick={onCancel}>취소</button>
                </div>
            </div>
        </div>
    );
}
