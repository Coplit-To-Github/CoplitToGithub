/* eslint-disable import/extensions */
import {
  checkRepoExists, checkFileExists, createNewFile, createRepo, createCommit,
} from './api.js';

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (request.action === 'Commit') {
    try {
      console.log('Commit action triggerd');
      const auth = await chrome.storage.local.get('auth');
      if (!auth) {
        console.log('access token and user name NOT found!');
        sendResponse('NO ACCESS TOKEN or USERNAME PROVIDED');
        return true;
      }
      console.log(auth);
      const { accessToken } = auth.auth;
      const { userName } = auth.auth;
      const repoTitle = 'coplit'; // TODO make variable
      const { fileName, fileContent, commitMessage } = request;
      const isRepoExists = await checkRepoExists(userName, accessToken, repoTitle);
      if (!isRepoExists) {
        console.log('repo not exist, creating repo');
        await createRepo(repoTitle, accessToken);
      }
      const isFileExists = await checkFileExists(userName, accessToken, repoTitle, fileName);
      if (!isFileExists) {
        console.log('file not exist, creating new file');
        await createNewFile(userName, accessToken, repoTitle, fileName, fileContent, commitMessage);
      } else {
        console.log('file exists, update existing commit');
        await createCommit(userName, accessToken, repoTitle, fileName, fileContent, commitMessage);
      }
      console.log('all process done');
      sendResponse({ message: 'Commit to Github is Done' });
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
  return false;
});

// https://developer.chrome.com/docs/extensions/mv3/service_workers/
// https://projecteli.tistory.com/203
