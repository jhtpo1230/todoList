## 📝 TodoList API 구현
> Node.js + Express + Swagger + MariaDB(Docker) 기반 Todo 관리 API
---

### 📘 프로젝트 개요
>이 프로젝트는 **Node.js(Express)** 기반으로 작성된 간단한 **Todo 관리 REST API**로,
>**MariaDB(MySQL2)** 를 Docker로 구동하며, **Swagger UI**를 통해 API 문서를 시각적으로 확인할 수 있다.
---
### 🚀 실행 방법

#### 1️⃣ 의존성 설치
```bash
npm install
```
#### 2️⃣ Docker로 MariaDB 실행

#### 3️⃣ 환경 변수 설정 (.env)

#### 4️⃣ 서버 실행
```bash
node server.js
```

서버 실행 후 아래 주소로 접속 👇
📍 Swagger UI: http://localhost:8080/swagger_todoAPI/

---
### 🧩 주요 기술 스택
| 기술                    | 설명             |
| --------------------- | -------------- |
| **Node.js (Express)** | RESTful API 서버 |
| **MariaDB (MySQL)**   | 데이터베이스         |
| **Docker** | DB 컨테이너 실행 및 환경 구성 |
| **Swagger**           | API 문서화 도구     |
---
### 🔧 DATABASE ERD (👇 추가 예정 👇)

<img width="796" height="435" alt="image" src="https://github.com/user-attachments/assets/c809681b-95b4-47dc-878c-1629811edc6b" />

---

### 🔧 USER TODO API 기능 (👇 추가 예정 👇)
| 메서드      | 경로          | 설명         |
| -------- | ----------- | ---------- |
| `GET`   | `/users/:userId/todos` | User Todo 전체 조회 |
| `POST`   | `/users/:userId/todos`   | User Todo 등록    |
| `PUT`    | `/users/:userId/todos/:id` | User Todo 수정    |
| `DELETE`   | `/users/:userId/todos/:id`     | User Todo 삭제  |
| `PATCH`   | `/users/:userId/todos/:id/complete`  | User Todo 완료/미완료  |

### 🔧 USER API 기능 (👇 추가 예정 👇)
| 메서드      | 경로          | 설명         |
| -------- | ----------- | ---------- |
| `POST`   | `/user/join`     | User 회원가입 |
| `POST`   | `/user/login`    | User 로그인   |

---
### 🧠 TroubleShooting (👇 추가 예정 👇)
| 이슈                          | 원인                    | 해결                                              |
| --------------------------- | --------------------- | ----------------------------------------------- |
| ⚙️ **Express + Swagger 충돌** | [Express 5.x 호환 문제]<br> swagger-ui-express는 아직 Express 4 기준으로 만들어져 있어서  Express 5 환경에서는 응답으로 "ERR_INVALID_HTTP_RESPONSE" (잘못된 응답 헤더) 오류를 띄움 | `npm install express@4.19.2` 로 express 다운그레이드  |
| 🚫 **Swagger UI 안 뜸**       | Chrome이 `6666` 포트를 "unsafe port"로 차단 | 안전한 개발용 포트 `PORT=8080`으로 변경  |                                             |
| 🐋 **Docker ENOENT 오류**     | Docker 컨테이너 포트번호와 서버 포트번호를 동일하게 설정하여 Docker Desktop 엔진 꺼짐  | 서버 포트번호를 변경하고 재실행   |
