function checkUserValidation() {
    const userId = document.querySelector("input[name=userId]").value;
    const userPwd = document.querySelector("input[name=userPwd]").value;
    const pattern = /^[a-zA-Z0-9]{4,12}$/;

    if (!pattern.test(userId)) {
        alert("아이디는 4~12자의 영문자/숫자 조합만 가능합니다.");
        return false;
    }
    if (!pattern.test(userPwd)) {
        alert("비밀번호는 4~12자의 영문자/숫자 조합만 가능합니다.");
        return false;
    }

    return true;
}

const join = document.getElementById("btn-join").addEventListener("click", () => {
    document.getElementById("main-content").innerHTML = `
    <h1>회원가입</h1><br>
        <form id="joinForm">
             <label>아이디: </label><input type="text" name="userId" placeholder="아이디 입력"><br>
             <label>비밀번호: </label><input type="password" name="userPwd" placeholder="비밀번호 입력"><br>
             <label>이메일: </label><input type="email" name="userEmail" placeholder="이메일 입력"><br>
             <label>전화번호: </label><input type="tel" name="userPhone" placeholder="전화번호 입력"><br>
             <label>주소: </label><input type="text" name="userAddr" placeholder="주소 입력"><br>
             <input type="submit" value="회원가입">
        </form>
    `;
    document.getElementById("joinForm").addEventListener("submit", (e) => {
        e.preventDefault();

        const form = e.target;

        if (!checkUserValidation()) {
            return;
        }


        if (localStorage.getItem("joinSeq") === null) {
            localStorage.setItem("joinSeq", 0);
        }
        let noSeq = Number(localStorage.getItem("joinSeq"));

        let joinArr = JSON.parse(localStorage.getItem("joinList"));
        if (joinArr === null) {
            joinArr = [];
        }
        const joinVo = {
            no: noSeq,
            id: form.userId.value,
            pwd: form.userPwd.value,
            email: form.userEmail.value,
            phone: form.userPhone.value,
            addr: form.userAddr.value,
            date: new Date().toLocaleString()
        };


        joinArr.push(joinVo);
        localStorage.setItem("joinList", JSON.stringify(joinArr));
        localStorage.setItem("joinSeq", noSeq + 1);
        alert("회원가입 성공!");
        form.reset();
    });
});


//==============================================================

const list = document.getElementById("btn-list").addEventListener("click", () => {
    let joinArr = JSON.parse(localStorage.getItem("joinList"));
    if (joinArr === null) {
        joinArr = [];
        alert("회원 정보가 없습니다.");
    }

    let table = `
    <h1>가입 정보 리스트</h1>
        <table class="join-table">
            <thead>
                <tr>
                    <th>no</th>
                    <th>id</th>
                    <th>email</th>
                    <th>phone</th>
                    <th>addr</th>
                    <th>date</th>
                    <th>삭제</th>
                </tr>
            </thead>
            <tbody>
    `;

    for (let joinVo of joinArr) {
        table += `
            <tr>
                <td>${joinVo.no}</td>
                <td>${joinVo.id}</td>
                <td>${joinVo.email}</td>
                <td>${joinVo.phone}</td>
                <td>${joinVo.addr}</td>
                <td>${joinVo.date}</td>
                <td>
                    <button onclick="deleteUser(${joinVo.no})">삭제</button>
                </td>
            </tr>
        `;
    }

    table += `</tbody></table>`;

    document.getElementById("main-content").innerHTML = table;
});

function deleteUser(no) {
    const joinStr = localStorage.getItem("joinList");
    const joinArr = JSON.parse(joinStr);

    for (let i = 0; i < joinArr.length; ++i) {
        if (joinArr[i].no == no) {
            const pwdInput = prompt("비밀번호를 입력하세요:");
            if (pwdInput === null) return;

            if (joinArr[i].pwd === pwdInput) {
                if (confirm(`${joinArr[i].id} 회원을 삭제하시겠습니까?`)) {
                    joinArr.splice(i, 1);
                    break;
                }
            } else {
                alert("비밀번호가 일치하지 않습니다.");
                return;
            }
        }
    }

    localStorage.setItem("joinList", JSON.stringify(joinArr));

    document.getElementById("btn-list").click();
}

//==============================================================


const board = document.getElementById("btn-board").addEventListener("click", () => {
    document.getElementById("main-content").innerHTML = `
        <div id="board-header" style="text-align: right;">
            <button id="btn-write">게시글 작성</button>
        </div>
        <div id="board-list"></div>

        <div id="board-modal" class="modal">
            <div class="modal-content">
                <h3>게시글 작성</h3>
                <input type="text" id="modal-title" placeholder="제목 입력"><br><br>
                <textarea id="modal-content" placeholder="내용 입력"></textarea><br><br>
                <button id="btn-save">저장</button>
                <button onclick="closeModal(document.getElementById('board-modal'))">닫기</button>
            </div>
        </div>
    `;
    document.getElementById("btn-write").addEventListener("click", () => {
        document.getElementById("board-modal").classList.add("active");
    });
    // 저장
    document.getElementById("btn-save").addEventListener("click", () => {
        const title = document.getElementById("modal-title").value;
        const content = document.getElementById("modal-content").value;
        if (!title || !content) {
            alert("제목과 내용을 모두 입력하세요.");
            return
        }

        if (localStorage.getItem("boardSeq") === null) {
            localStorage.setItem("boardSeq", 0);
        }
        if (localStorage.getItem("boardList") === null) {
            localStorage.setItem("boardList", "[]");
        }

        const seq = Number(localStorage.getItem("boardSeq"));
        const boardList = JSON.parse(localStorage.getItem("boardList"));

        boardList.push({
            no: seq,
            title,
            content,
            date: new Date().toLocaleString()
        });

        localStorage.setItem("boardList", JSON.stringify(boardList));
        localStorage.setItem("boardSeq", seq + 1);

        document.getElementById("modal-title").value = "";
        document.getElementById("modal-content").value = "";

        document.getElementById("board-modal").classList.remove("active");
        BoardList(); // 목록 갱신
    });

    BoardList(); // 초기 목록 로드
});

function closeModal(x) {
    x.classList.remove("active");
}

function BoardList() {
    const boardArr = JSON.parse(localStorage.getItem("boardList"));
    const boardContainer = document.getElementById("board-list");

    if (!boardContainer) return; // 예외 방어

    if (boardArr === null || boardArr.length === 0) {
        boardContainer.innerHTML = "<p>게시글이 없습니다.</p>";
        return;
    }

    // 테이블 
    let table = `
        <table border="1">
            <thead>
                <tr>
                    <th>번호</th>
                    <th>제목</th>
                    <th>작성일</th>
                    <th>조회</th>
                    <th>삭제</th>
                </tr>
            </thead>
            <tbody>
    `;

    for (let board of boardArr) {
        table += `
            <tr>
                <td>${board.no}</td>
                <td>${board.title}</td>
                <td>${board.date}</td>
                <td><button onclick="selectBoard(${board.no})">조회</button></td>
                <td><button onclick="deleteBoard(${board.no})">삭제</button></td>
            </tr>
        `;
    }

    table += `
            </tbody>
        </table>
        <div id="view-board"></div>
    `;

    boardContainer.innerHTML = table;
}

function selectBoard(no) {
    const boardArr = JSON.parse(localStorage.getItem("boardList"));
    for (let board of boardArr) {
        if (board.no == no) {
            document.getElementById("view-board").innerHTML = `
                <h3>내용 보기</h3>
                <textarea>${board.content}</textarea>
            `;
            break;
        }
    }
}
function deleteBoard(no) {

    const boardStr = localStorage.getItem("boardList");
    let boardArr = JSON.parse(boardStr);

    if (boardArr === null) {
        alert("게시글이 없습니다.");
        return;
    }


    for (let i = 0; i < boardArr.length; i++) {
        if (boardArr[i].no == no) {
            const confirmMsg = confirm(`${boardArr[i].title}을 삭제하시겠습니까?`);
            if (confirmMsg) {
                boardArr.splice(i, 1);
                localStorage.setItem("boardList", JSON.stringify(boardArr));
                alert("삭제되었습니다.");
                BoardList();
            }
            break;
        }
    }
}

//==================================================================

const info = document.getElementById("btn-info").addEventListener("click", () => {
    document.getElementById("main-content").innerHTML = `
        <h2>📘 프로그램 설명</h2>
        <p>
            이 프로그램은 <strong>로컬스토리지(localStorage)</strong>를 이용해 회원 가입과 게시판 기능을 구현한 웹 애플리케이션입니다.<br><br>

            <strong>1. 회원가입 기능</strong><br>
            - 아이디, 비밀번호, 이메일, 전화번호, 주소를 입력하여 가입합니다.<br>
            - 입력된 데이터는 로컬스토리지에 저장되고 리스트로 출력할 수 있습니다.<br>
            - 삭제 시 비밀번호 확인을 요구합니다.<br><br>

            <strong>2. 게시판 기능</strong><br>
            - 게시글 작성 버튼을 통해 모달 창이 나타납니다.<br>
            - 제목과 내용을 입력하여 저장하며, 작성일과 함께 목록에 출력됩니다.<br>
            - ‘조회’ 버튼 클릭 시 하단에 내용을 확인할 수 있으며, 삭제도 가능합니다.<br><br>

            ✨ 모든 정보는 브라우저의 <em>로컬 저장소(localStorage)</em>를 사용하므로 새로고침해도 데이터가 유지됩니다.
        </p>
    `;
});