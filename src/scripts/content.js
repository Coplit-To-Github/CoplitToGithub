const makeGitHubBtn = ()=>{
  const url = new URL(window.location.href);

  if (!url.pathname.match(/codeproblem/)) return;
  
  const btnGroup = document.querySelector('div.item.end');

  const githubBtn = document.createElement('button');
  githubBtn.textContent = 'Commit To Github';
  githubBtn.className = "btn";
  githubBtn.id = 'githubBtn';

  btnGroup.appendChild(githubBtn);

  githubBtn.addEventListener('click', async () => {
    const scoreText = document.querySelector('div.codeproblem-console-content > div > div')?.textContent;
    if (scoreText === undefined || scoreText === '테스트 결과가 없습니다.') {
      alert('테스트 후에 커밋하세요!');
      return;
    }

    makeGitHubModal();
  })
}

// ==============================
//            Modal
// ==============================

const makeGitHubModal = async()=>{
  const gitModalInnerHTML =
  `
    <div class="ant-modal-mask ant-fade-enter ant-fade-enter-active">
      <div class="ant-modal-wrap activate">
        <div class="ant-modal">
          <div class="ant-modal-content">
            <div class="ant-modal-header">
              <div class="ant-modal-title">커밋하기</div>
            </div>
            <div class="ant-modal-body">
              <input class="commit-message-input" name="commit-message" placeholder="커밋 메시지를 입력해주세요.">
              <div class="btn-group">
                <button class="ant-btn btn btn-cancel">취소</button>
                <button class="ant-btn btn btn-primary btn-commit">커밋</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `

  const gitModal = document.createElement("div");
  gitModal.className="git-coplit-modal";
  gitModal.innerHTML= gitModalInnerHTML;
  document.body.prepend(gitModal);

  const modalMask = document.querySelector(".git-coplit-modal .ant-modal-mask");
  const modalWrap = document.querySelector(".git-coplit-modal .ant-modal-wrap");

  const commitMessageInput = document.querySelector(".git-coplit-modal .commit-message-input");
  const cancelBtn = document.querySelector(".git-coplit-modal .btn-cancel");
  const commitBtn = document.querySelector(".git-coplit-modal .btn-commit");

  // Function Remove modal
  const removeModal = ()=>{
    modalMask.classList.toggle("ant-fade-enter");
    modalMask.classList.toggle("ant-fade-enter-active");
    modalMask.classList.toggle("ant-fade-leave");
    modalMask.classList.toggle("ant-fade-leave-active");
    initInput();
    setTimeout(()=>{
      document.body.removeChild(gitModal);
    }, 600);
  }

  // Handler
  const initInput = (input)=>{
    commitMessageInput.value = "";
  }

  const cancelBtnHandler = ()=>{
    removeModal();
  }

  const commitBtnHandler = async()=>{
    const url = new URL(window.location.href);

    const problemHash = url.pathname.split('/')[2];

    const fileName = `${document.querySelector('span.problem-title').textContent}.js`;
    const fileContent = localStorage.getItem(problemHash);

    const commitMessage = commitMessageInput.value;
    
    alert('해당 코드를 커밋합니다.');
    await chrome.runtime.sendMessage({
      action: 'Commit', fileName, fileContent, commitMessage,
    }, (response) => {
      removeModal();
      alert(response.message);
      alert("커밋 완료");
    });
  }

  // Register EventListener
  cancelBtn.addEventListener("click", cancelBtnHandler);
  commitBtn.addEventListener("click", commitBtnHandler);
}


//=================================
//       Make GitHubBtn
//=================================
setTimeout(()=>{makeGitHubBtn()},0);

window.addEventListener("locationchange", ()=>{
  setTimeout(()=>{
    if (document.getElementById("githubBtn")){
      const oldBtn = document.getElementById("githubBtn");
      oldBtn.remove();
    }
    
    
    
    makeGitHubBtn();
  },0);
})

// https://stackoverflow.com/questions/3522090/event-when-window-location-href-changes
