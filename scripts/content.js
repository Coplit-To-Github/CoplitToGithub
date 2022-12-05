const main = async () => {
  const url = new URL(window.location.href);
  const problemHash = url.pathname.split('/')[2];

  const btnGroup = document.querySelector('div.item.end');

  const githubBtn = document.createElement('button');
  githubBtn.textContent = 'Commit To Github';
  githubBtn.style.backgroundColor = '#ff9900';
  githubBtn.style.color = 'white';
  githubBtn.style.height = 'white';

  githubBtn.style.padding = '10px';
  githubBtn.style.borderRadius = '10px';
  githubBtn.style.margin = '0px 10px';
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

    alert('해당 코드를 커밋합니다.');
    chrome.runtime.sendMessage({
      action: 'Commit', fileName, fileContent, commitMessage,
    }, (response) => {
      alert(response.message);
      alert('커밋 완료!');
    });
  });
};

main();

setInterval(() => {
  if (!document.getElementById('githubBtn') && window.location.href.includes('codeproblem')) {
    main();
  }
}, 2000);

// https://stackoverflow.com/questions/3522090/event-when-window-location-href-changes
