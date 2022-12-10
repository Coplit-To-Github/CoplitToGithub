const makeGitHubBtn = ()=>{
  const url = new URL(window.location.href);

  if (!url.pathname.match(/codeproblem/)) return;

  const problemHash = url.pathname.split('/')[2];
  
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
    const fileName = `${document.querySelector('span.problem-title').textContent}.js`;
    const fileContent = localStorage.getItem(problemHash);

    // TODO 커밋 메시지 입력 가능하게 만든다.
    const commitMessage = '';
    
    // // TEST명령줄 (나중에 지우세요)
    // const modalContainer = document.querySelector(".modal-container")
    // modalContainer.classList.toggle("activate");

    alert('해당 코드를 커밋합니다.');
    chrome.runtime.sendMessage({
      action: 'Commit', fileName, fileContent, commitMessage,
    }, (response) => {
      alert(response.message);
      alert('커밋 완료!');
    });
  })
}


const makeGitHubModal = ()=>{
  const modalContainer = document.createElement("div");
  const modal = document.createElement("div");
  const commitMessageInput = document.createElement("input");
  const btnGroup = document.createElement("div");
  const cancelBtn = document.createElement("button");
  const commitBtn = document.createElement("button");

  // Commit Message Input
  commitMessageInput.className = "commit-message-input";
  commitMessageInput.name = "commit-message";
  commitMessageInput.placeholder = "커밋 메시지를 입력해주세요.";

  // Buttons
  btnGroup.className = "btn-group";

  cancelBtn.className = "btn";
  cancelBtn.textContent = "취소";

  commitBtn.className = "btn btn-primary"
  commitBtn.textContent = "커밋";

  btnGroup.append(cancelBtn, commitBtn);

  // Modal
  modalContainer.className = "modal-container";
  modal.className= "modal";

  modal.append(commitMessageInput, btnGroup);
  modalContainer.append(modal);

  // Inject modal to document;
  document.body.prepend(modalContainer);


  // Handlers
  const initInput = (input)=>{
    commitMessageInput.value = "";
  }

  cancelBtn.addEventListener("click", ()=>{
    modalContainer.classList.toggle("activate");
    initInput();
  })
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

makeGitHubModal();

// https://stackoverflow.com/questions/3522090/event-when-window-location-href-changes
