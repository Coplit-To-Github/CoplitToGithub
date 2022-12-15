const DATABASE = 'coplitToGithub';
const DB_VERSION = 1;
const DB_STORE_NAME = 'auth';

openDB = () => {
  // DB 생성
  const req = indexedDB.open(DATABASE, DB_VERSION);

  // DB 생성 성공
  req.onsuccess = function (evt) {
    db = this.result;
  };
  // DB 생성 오류
  req.onerror = function (evt) {
    console.error('indexedDB : ', evt.target.errorCode);
  };
  // DB 초기화
  req.onupgradeneeded = function (evt) {
    const store = evt.currentTarget.result.createObjectStore(
      DB_STORE_NAME,
      { keyPath: 'userName', autoIncrement: false },
    );

    store.createIndex('userName', 'userName', { unique: true });
    store.createIndex('accessToken', 'accessToken', { unique: true });
    store.createIndex('timeStamp', 'timeStamp', { unique: false });
  };
};

// openDB()
// this transaction worksFine
// var transaction = db.transaction("auth", "readwrite").objectStore("auth").add(payload);
