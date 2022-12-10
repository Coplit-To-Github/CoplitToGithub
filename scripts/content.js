const makeGitHubBtn = ()=>{
  const url = new URL(window.location.href);

  if (!url.pathname.match(/codeproblem/)) return;

  const problemHash = url.pathname.split('/')[2];
  
  const btnGroup = document.querySelector('div.item.end');

  const githubBtn = document.createElement('button');
  githubBtn.textContent = 'Commit To Github';
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

    chrome.action.setPopup('/static/popup_commit.html');
    // TODO 커밋 메시지 입력 가능하게 만든다.
    const commitMessage = '';

    alert('해당 코드를 커밋합니다.');
    chrome.runtime.sendMessage({
      action: 'Commit', fileName, fileContent, commitMessage,
    }, (response) => {
      alert(response.message);
      alert('커밋 완료!');
    });
  })
}

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
