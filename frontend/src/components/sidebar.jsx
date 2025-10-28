import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getTeams, logoutUser } from "../api/todo_api";
import TeamCreateModal from "./team_create_modal"; // 팀 생성용
import TeamDeleteModal from "./team_delete_modal"; // 팀 삭제용
import TeamManageModal from "./team_manage_modal"; // 팀원 관리용

import "../styles/sidebar.css";

export default function Sidebar({ onSelect, setTeamId }) {
    const [teams, setTeams] = useState([]);
    const [showLogout, setShowLogout] = useState(false);
    const [showCreateTeamModal, setShowCreateTeamModal] = useState(false); // 팀 생성 모달
    const [selectedTeamId, setSelectedTeamId] = useState(null); // 팀 관리용 id
    const [showMenuId, setShowMenuId] = useState(null); // 현재 열린 메뉴 추적
    const [showManageModal, setShowManageModal] = useState(false); // 팀원 초대 모달
    const [showDeleteModal, setShowDeleteModal] = useState(false); // 팀 삭제 모달
    const [teamToDelete, setTeamToDelete] = useState(null); // 추가

    const userId = localStorage.getItem("userId");
    const loginId = localStorage.getItem("loginId"); // 로그아웃 부분에 띄워주기 위해 추가
    const navigate = useNavigate();

    const fetchTeams = async () => {
        try {
            const res = await getTeams(userId);
            setTeams(res);
        } catch (err) {
            console.error("팀 목록 불러오기 실패:", err);
        }
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    // 로그아웃 함수 추가
    const handleLogout = async () => {
        try {
            // 현재 보고 있는 페이지가 개인(0)인지 팀 페이지인지 구분
            const lastViewPage = localStorage.getItem("lastViewPage") || null;

            const res = await logoutUser(userId, lastViewPage);
            alert(res.message);

            // 로컬 데이터 정리
            localStorage.clear();

            // 로그인 페이지로 이동
            navigate("/login");
        } catch (error) {
            console.error("로그아웃 오류:", error);
            alert("로그아웃 중 문제가 발생했습니다.");
        }
    };

    // ... 버튼 클릭 시 메뉴 열기/닫기
    const toggleMenu = (teamId) => {
        setShowMenuId(showMenuId === teamId ? null : teamId);
    };

    // 초대하기 클릭 시 모달 열기
    const handleInvite = (teamId) => {
        setSelectedTeamId(teamId);
        setShowManageModal(true);
        setShowMenuId(null);
    };

    // 삭제하기 버튼 클릭 시 모달 열기
    const handleDeleteClick = (teamId) => {
        setTeamToDelete(teamId);
        setShowDeleteModal(true);
        setShowMenuId(null);
    };

    return (
        <div className="sidebar">
            <div className="sidebar-top">
                <button
                    className="sidebar-btn"
                    onClick={() => onSelect("personal")}
                >
                    개인 할 일 목록
                </button>

                {teams.map((team) => (
                    <div key={team.team_id} className="team-item-container">
                        {/* ✅ 바깥쪽을 div로 변경 */}
                        <div
                            className="sidebar-btn team-btn"
                            onClick={() => onSelect(`team-${team.team_id}`)}
                            role="button"
                            tabIndex={0}
                        >
                            <span>{team.team_name}</span>

                            {/* ... 버튼을 별도 wrapper로 분리 (중첩 button 제거) */}
                            <div className="more-wrapper">
                                <button
                                    className="team-more-btn"
                                    onClick={(e) => {
                                        e.stopPropagation(); // 부모 div 클릭 방지
                                        toggleMenu(team.team_id);
                                    }}
                                >
                                    ...
                                </button>

                                {/* 드롭다운 메뉴 */}
                                {showMenuId === team.team_id && (
                                    <div className="dropdown-menu">
                                        <p
                                            onClick={() =>
                                                handleInvite(team.team_id)
                                            }
                                        >
                                            초대하기
                                        </p>
                                        <p
                                            onClick={() =>
                                                handleDeleteClick(team.team_id)
                                            }
                                        >
                                            삭제하기
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {/* 팀 만들기 버튼 */}
                <button
                    className="sidebar-btn create-team"
                    onClick={() => setShowCreateTeamModal(true)}
                >
                    팀 만들기
                </button>
            </div>

            <div className="sidebar-bottom">
                <span className="login-id">{loginId && `ID: ${loginId}`}</span>
                <div className="more-container">
                    <button
                        className="more-btn"
                        onClick={() => setShowLogout(!showLogout)}
                    >
                        ...
                    </button>
                    {showLogout && (
                        <button className="logout-btn" onClick={handleLogout}>
                            로그아웃
                        </button>
                    )}
                </div>
            </div>

            {/* 팀 생성 모달 */}
            {showCreateTeamModal && (
                <TeamCreateModal
                    onClose={() => setShowCreateTeamModal(false)}
                    onTeamCreated={fetchTeams}
                />
            )}

            {/* 초대 모달 */}
            {showManageModal && (
                <TeamManageModal
                    teamId={selectedTeamId}
                    onClose={() => setShowManageModal(false)}
                />
            )}

            {/* 팀 삭제 모달 */}
            {showDeleteModal && (
                <TeamDeleteModal
                    teamId={teamToDelete}
                    onClose={() => setShowDeleteModal(false)}
                    onDeleted={async () => {
                        // 1. 즉시 개인 페이지로 전환
                        setTeamId(0);
                        localStorage.setItem("lastViewPage", 0);

                        // 2. 잠깐 대기 후 팀 목록 새로고침 (렌더 순서 안정화)
                        await new Promise((resolve) =>
                            setTimeout(resolve, 100)
                        );
                        await fetchTeams();
                    }}
                />
            )}
        </div>
    );
}
