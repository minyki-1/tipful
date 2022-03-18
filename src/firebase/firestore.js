import firebase from './config'

const db = firebase.firestore()

export function getDate(overTime = 0) { // 년(2)/월(2)/일(2)/시(2)/분(2)/초(2)/밀리(1)
  let date = new Date();
  const dateNum = Number(String((date.getFullYear() - 2000).length == 1 ? date.getFullYear() - 2000 : '0' + String(date.getFullYear() - 2000)) + String(date.getMonth().length == 1 ? date.getMonth() + 1 : '0' + String(date.getMonth() + 1)) + String(date.getDate() > 9 ? date.getDate() : '0' + String(date.getDate())) + String(date.getHours() > 9 ? date.getHours() : '0' + String(date.getHours())) + String(date.getMinutes() > 9 ? date.getMinutes() : '0' + String(date.getMinutes())) + String(date.getSeconds() > 9 ? date.getSeconds() : '0' + String(date.getSeconds())) + String(Math.floor(date.getMilliseconds() / 100))) + overTime
  return dateNum
}

async function getDataByQuery(query,storageName) {
  const sStorage = JSON.parse(sessionStorage.getItem(storageName));
  if(sStorage && sStorage[0] > getDate()){
    sStorage.shift();
    return sStorage
  }else{
    const dataArray = []
    await query.then((docs)=>{
      const user = getUser();
      docs.forEach((doc)=>{
        const data = doc.data()
        let bookmark = false;
        let like = false;
        if(user){
          if(data.bookmark.includes(user.uid)){
            bookmark = true
          }
          if(data.like.includes(user.uid)){
            like = true
          }
        }
        dataArray.push({...doc.data(),id:doc.id,bookmark:bookmark,like:like,likeCount:data.like.length,bookmarkCount:data.bookmark.length});
      })
      dataArray.unshift(getDate(400)) // 데이터 리프레시 주기 400( 40초 )
    }).catch(err=>{
      alert('게시물 불러오기 실패\n' + err);
    })
    sessionStorage.setItem(storageName,JSON.stringify(dataArray))
    dataArray.shift();
    return dataArray
  }
}

export function getPopularData() {
  const query = db.collection('post').get();

  return getDataByQuery(query,'popular')
}

export async function addLike(isLike,docId) {
  const user = getUser();
  const likeDelay = sessionStorage.getItem('likeDelay');
  if(user){
    if(likeDelay < getDate()){
      sessionStorage.setItem('likeDelay',getDate(3));
      const query = db.collection("post").doc(docId);
      return db.runTransaction((transaction) => {
        return transaction.get(query).then((doc) => {
          if (!doc.exists) {
            alert('데이터가 존재하지 않습니다')
          }
          const likeData = doc.data().like;
          const bookmarkData = doc.data().bookmark;
          if(!isLike){
            if(likeData.includes(user.uid)){
              alert('이미 좋아요 함')
            }else{
              likeData.push(user.uid);
              transaction.update(query, { like: likeData,rank:(bookmarkData.length + 1) * (likeData.length + 1) })
              for (var key in sessionStorage) {
                let sStorage = JSON.parse(sessionStorage.getItem(key))
                if(sStorage && typeof sStorage == 'object'){
                  sStorage.forEach((doc,i)=>{
                    if(doc.id === docId){
                      sStorage[i].like = true;
                      sStorage[i].likeCount = sStorage[i].likeCount + 1;
                      sessionStorage.setItem(key,JSON.stringify(sStorage))
                    }
                  })
                }
              }
              return true
            }
          }else{
            if(!likeData.includes(user.uid)){
              alert('이미 좋아요 안함')
            }else{
              likeData.splice(likeData.findIndex(i => i == user.uid), 1);
              transaction.update(query, { like: likeData,rank:(bookmarkData.length + 1) * (likeData.length + 1) })
              for (var key in sessionStorage) {
                let sStorage = JSON.parse(sessionStorage.getItem(key))
                if(sStorage && typeof sStorage == 'object'){
                  sStorage.forEach((doc,i)=>{
                    if(doc.id === docId){
                      sStorage[i].like = false;
                      sStorage[i].likeCount = sStorage[i].likeCount - 1;
                      sessionStorage.setItem(key,JSON.stringify(sStorage))
                    }
                  })
                }
              }
              return true
            }
          }
        });
      }).catch((err) => {
        alert("좋아요 실패\n" + err);
      });
    }
  }else{
    alert('로그인 해야합니다.');
  }
  return false
}

export async function addBookmark(isBookmark,docId) {
  const user = getUser();
  const bookmarkDelay = sessionStorage.getItem('bookmarkDelay');
  if(user){
    if(bookmarkDelay < getDate()){
      sessionStorage.setItem('bookmarkDelay',getDate(3));
      const query = db.collection("post").doc(docId);
      return db.runTransaction((transaction) => {
        return transaction.get(query).then((doc) => {
          if (!doc.exists) {
            alert('데이터가 존재하지 않습니다')
          }
          const likeData = doc.data().like;
          const bookmarkData = doc.data().bookmark;
          if(!isBookmark){
            if(bookmarkData.includes(user.uid)){
              alert('이미 북마크 함')
            }else{
              bookmarkData.push(user.uid);
              console.log(bookmarkData,likeData)
              transaction.update(query, { bookmark: bookmarkData,rank:(bookmarkData.length + 1) * (likeData.length + 1) })
              for (var key in sessionStorage) {
                let sStorage = JSON.parse(sessionStorage.getItem(key))
                if(sStorage && typeof sStorage == 'object'){
                  sStorage.forEach((doc,i)=>{
                    if(doc.id === docId){
                      sStorage[i].bookmark = true;
                      sStorage[i].bookmarkCount = sStorage[i].bookmarkCount + 1;
                      sessionStorage.setItem(key,JSON.stringify(sStorage))
                    }
                  })
                }
              }
              return true
            }
          }else{
            if(!bookmarkData.includes(user.uid)){
              alert('이미 북마크 안함')
            }else{
              bookmarkData.splice(bookmarkData.findIndex(i => i == user.uid), 1);
              transaction.update(query, { bookmark: bookmarkData,rank:(bookmarkData.length + 1) * (likeData.length + 1) })
              for (var key in sessionStorage) {
                let sStorage = JSON.parse(sessionStorage.getItem(key))
                if(sStorage && typeof sStorage == 'object'){
                  sStorage.forEach((doc,i)=>{
                    if(doc.id === docId){
                      sStorage[i].bookmark = false;
                      sStorage[i].bookmarkCount = sStorage[i].bookmarkCount - 1;
                      sessionStorage.setItem(key,JSON.stringify(sStorage))
                    }
                  })
                }
              }
              return true
            }
          }
        })
      }).catch((err) => {
        alert("북마크 실패\n" + err);
      });
    }
    
  }else{
    alert('로그인 해야합니다.');
  }
  return false
}

function getUser() {
  const user = firebase.auth().currentUser;
  if (user !== null && user !== undefined) {
    const displayName = user.displayName;
    const photoURL = user.photoURL;
    const uid = user.uid;
    return {displayName,photoURL,uid}
  }else{
    return null
  }
}

export function signIn() {
  const user = getUser();
  if(user === null){
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        var provider = new firebase.auth.GoogleAuthProvider();
        return firebase.auth().signInWithPopup(provider);
      }).catch((error) => {
        alert('로그인 실패\n' + error.message)
      }).then((result) => {
        const user = {photo:result.user.photoURL,name:result.user.displayName}
        localStorage.setItem('user',JSON.stringify(user))
        alert('로그인 성공!')
        window.location.reload();
      }).catch((error) => {
        alert('지속 저장 설정 실패\n' + error.message)
      });
  }else{
    alert('이미 로그인 했습니다.')
  }
}

export function signOut() {
  const user = getUser();
  if(user){
    if(window.confirm('로그아웃 하겠습니까?')){
      firebase.auth().signOut().then(() => {
        localStorage.removeItem('user')
        alert('로그아웃완료');
        window.location.reload();
      }).catch((error) => {
        var errorMessage = error.message;
        alert(errorMessage);
      });
    }
  }else{
    alert('로그인되어 있지 않습니다');
  }
}