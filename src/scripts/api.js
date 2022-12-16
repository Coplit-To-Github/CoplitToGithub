/* eslint-disable max-len */
const checkRepoExists = async (userName = 'atoye1', repoTitle = 'coplit') => {
  const url = `https://api.github.com/repos/${userName}/${repoTitle}`;
  try {
    const result = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.github+json',
      },
    });
    const resultData = await result.json();
    if (resultData.message === 'Not Found') {
      console.log('repo NOT exists');
      return false;
    }
    console.log('repo already exists');
    return true;
  } catch (err) {
    console.log('NOT exists');
    return false;
  }
};

const createRepo = async (repoTitle, accessToken) => {
  const url = 'https://api.github.com/user/repos';
  const data = {
    name: repoTitle,
    type: 'private',
  };
  try {
    const result = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });
    console.log(result.json());
  } catch (err) {
    console.error(err);
  }
};

const checkFileExists = async (userName = 'atoye1', repoTitle = 'coplit', fileName = '05_tiling.js') => {
  const url = `https://api.github.com/repos/${userName}/${repoTitle}/contents/${fileName}`;
  try {
    const result = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.github+json',
      },
    });
    const checkResult = await result.json();
    if (checkResult.name === fileName) {
      return true;
    }
    return false;
  } catch (err) {
    console.log(`${fileName} NOT exists`);

    return false;
  }
};

const createNewFile = async (userName, repoTitle, fileName, fileContent, commitMessage, accessToken) => {
  const url = `https://api.github.com/repos/${userName}/${repoTitle}/contents/${fileName}`;
  const encodedContent = btoa(unescape(encodeURIComponent(fileContent)));
  const data = {
    message: `Creating ${fileName}\n${commitMessage}`,
    content: encodedContent,
  };
  try {
    const result = await fetch(url, {
      method: 'PUT',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });
    const responseData = await result.json();
    if (responseData.commit === undefined) {
      throw new Error('no valid response found for creating new file');
    }
    return responseData;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const createCommit = async (userName, repoTitle, fileName, fileContent, commitMessage, accessToken) => {
  const checkingUrl = `https://api.github.com/repos/${userName}/${repoTitle}/commits`;
  try {
    const checkResult = await fetch(checkingUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const checkData = await checkResult.json();
    console.log(checkData);
    const treeUrl = checkData[0].commit.tree.url;
    const treeResult = await fetch(treeUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const treeData = await treeResult.json();
    let fileSha = null;
    console.log(treeData);
    treeData.tree.some((elem) => {
      if (elem.path === fileName) {
        fileSha = elem.sha;
        return true;
      }
      return false;
    });
    if (!fileSha) throw new Error(`Sha of ${fileName} not found`);

    // sha value found! moving to commit logics
    const url = `https://api.github.com/repos/${userName}/${repoTitle}/contents/${fileName}`;
    const encodedContent = btoa(unescape(encodeURIComponent(fileContent)));

    const data = {
      message: `Updating ${fileName}\n${commitMessage}`,
      content: encodedContent,
      sha: fileSha,
    };

    const result = await fetch(url, {
      method: 'PUT',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(data),
    });
    const updateData = await result.json();
    console.log(updateData);
    return updateData;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export {
  checkRepoExists, checkFileExists, createNewFile, createRepo, createCommit,
};
