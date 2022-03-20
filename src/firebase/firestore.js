import firebase from './config'

const db = firebase.firestore()

export function getDate(overTime = 0) { // 년(2)/월(2)/일(2)/시(2)/분(2)/초(2)/밀리(1)
  let date = new Date();
  const dateNum = Number(String((date.getFullYear() - 2000).length == 1 ? date.getFullYear() - 2000 : '0' + String(date.getFullYear() - 2000)) + String(date.getMonth().length == 1 ? date.getMonth() + 1 : '0' + String(date.getMonth() + 1)) + String(date.getDate() > 9 ? date.getDate() : '0' + String(date.getDate())) + String(date.getHours() > 9 ? date.getHours() : '0' + String(date.getHours())) + String(date.getMinutes() > 9 ? date.getMinutes() : '0' + String(date.getMinutes())) + String(date.getSeconds() > 9 ? date.getSeconds() : '0' + String(date.getSeconds())) + String(Math.floor(date.getMilliseconds() / 100))) + overTime
  return dateNum
}

async function getDataByQuery(query,storageName) {
  const sStorage = storageName ? JSON.parse(sessionStorage.getItem(storageName)) : false;
  if(sStorage && sStorage[0] > getDate()){
    sStorage.shift();
    return sStorage
  }else{
    const dataArray = []
    await query.then((docs)=>{
      const user = getCurrentUser();
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
        let title = [];
        data.title.forEach((txt)=>{
          title.push(txt)
        })
        dataArray.push({...doc.data(),id:doc.id,title:title,bookmark:bookmark,like:like,likeCount:data.like.length,bookmarkCount:data.bookmark.length});
      })
      dataArray.unshift(getDate(1400)) // 데이터 리프레시 주기 1400( 1분 40초 )
    }).catch(err=>{
      alert('게시물 불러오기 실패\n' + err);
    })
    if(storageName){
      sessionStorage.setItem(storageName,JSON.stringify(dataArray))
    }
    dataArray.shift();
    return dataArray
  }
}

export function getPopularData() {
  const query = db.collection('post').orderBy("rank", "desc").limit(8).get();
  return getDataByQuery(query,'popular')
}

export function getRecentData() {
  const query = db.collection('post').orderBy("date", "desc").limit(8).get();
  return getDataByQuery(query,'recent')
}

export async function getBookmarkData() {
  const user = JSON.parse(localStorage.getItem('user'));
  if(user){
    const query = db.collection('post').where("bookmark", "array-contains", user.uid).limit(8).get();
    return getDataByQuery(query,'bookmark')
  }
}

export function getSearchData(keyword) {
  if(keyword != ''){
    let keywordArray = [];
    keyword.split(' ').forEach(text=>{
      if(text != '' && text != ' '){
        keywordArray.push(text)
      }
    })
    const query = db.collection('post').where("title", "array-contains-any",keywordArray).limit(8).get();
    return getDataByQuery(query)
  }
}

export function getMyPostData() {
  const user = JSON.parse(localStorage.getItem('user'));
  if(user){
    const query = db.collection('post').where("writer", "==", user.uid).limit(8).get();
    return getDataByQuery(query,'mypost')
  }
}

export async function editLike(isLike,docId) {
  const user = getCurrentUser();
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

export async function editBookmark(isBookmark,docId) {
  const user = getCurrentUser();
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
              transaction.update(query, { bookmark: bookmarkData,rank:(bookmarkData.length + 1) * (likeData.length + 1) })
              let isEditBookmark = false
              for (var key in sessionStorage) {
                let sStorage = JSON.parse(sessionStorage.getItem(key))
                if(sStorage && typeof sStorage == 'object'){
                  sStorage.forEach((doc,i)=>{
                    if(doc.id === docId){
                      sStorage[i].bookmark = true;
                      sStorage[i].bookmarkCount = sStorage[i].bookmarkCount + 1;
                      sessionStorage.setItem(key,JSON.stringify(sStorage))
                      if(!isEditBookmark){
                        isEditBookmark = true
                        const bookmarkStorage = JSON.parse(sessionStorage.getItem('bookmark'))
                        if(bookmarkStorage){
                          bookmarkStorage.push(sStorage[i])
                          sessionStorage.setItem('bookmark',JSON.stringify(bookmarkStorage))
                        }
                      }
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
                    const bookmarkStorage = JSON.parse(sessionStorage.getItem('bookmark'))
                    if(bookmarkStorage){
                      bookmarkStorage.forEach((doc,i)=>{
                        if(doc.id === docId){
                          bookmarkStorage.splice(i,1)
                          sessionStorage.setItem('bookmark',JSON.stringify(bookmarkStorage))
                        }
                      })
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

export function getCurrentUser() {
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

export async function getUserData(uid = false) {
  const userStorage = JSON.parse(sessionStorage.getItem('user'))
  if(uid){
    if(userStorage){
      let user;
      let isIn = false
      userStorage.forEach((doc,i)=>{
        if(doc.id === uid){
          user = userStorage[i]
          isIn = true
        }
      })
      if(!isIn){
        await db.collection('user').doc(uid).get().then((doc)=>{
          user = {...doc.data(),id:doc.id}
          sessionStorage.setItem('user',JSON.stringify([...userStorage,user]))
        })
        return user
      }
      return user
    }else{
      let user;
      await db.collection('user').doc(uid).get().then((doc)=>{
        user = {...doc.data(),id:doc.id}
        sessionStorage.setItem('user',JSON.stringify([user]))
      })
      return user
    }
  }
  return false
}

export function signIn() {
  const user = getCurrentUser();
  if(user === null){
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() => {
        var provider = new firebase.auth.GoogleAuthProvider();
        return firebase.auth().signInWithPopup(provider);
      }).catch((error) => {
        alert('로그인 실패\n' + error.message)
      }).then((result) => {
        const displayName = result.user.displayName;
        const photoURL = result.user.photoURL;
        const uid = result.user.uid;
        const userData = {photoURL:photoURL,displayName:displayName,uid:uid}
        db.collection('user').doc(uid).set(userData).then(()=>{
          localStorage.setItem('user',JSON.stringify(userData))
          alert('로그인 성공!')
          window.location.reload();
        }).catch((err)=>{
          alert('사용자 정보 저장 실패' + err)
        })
      }).catch((error) => {
        alert('사용자 정보 저장 실패\n' + error.message)
      });
  }else{
    alert('이미 로그인 했습니다.')
  }
}

export function signOut() {
  const user = getCurrentUser();
  if(user){
    if(window.confirm('로그아웃 하겠습니까?')){
      firebase.auth().signOut().then(() => {
        alert('로그아웃완료');
        window.location.reload();
      }).catch((error) => {
        alert('로그아웃 실패\n' + error.message);
      });
    }
  }else{
    alert('로그인되어 있지 않습니다.');
  }
}


export function postTip(title,content) {
  const user = getCurrentUser();
  if(user){
    if(title && content && title !== '' && content != '' && content != '<p><br></p>' && content != '<h1><br></h1>' && content != '<h2><br></h2>'){
      const date = getDate()
      let titleArray = [];
      title.split(' ').forEach(text=>{
        if(text != '' && text != ' '){
          titleArray.push(text)
        }
      })
      const postData = {title:titleArray,content:content,bookmark:[],like:[],date:date,rank:1,writer:user.uid}
      db.collection('post').add(postData).then(()=>{
        alert('포스트 성공!');
        window.history.back();
      }).catch((err)=>{
        alert('포스트 실패\n' + err);
      })
    }else{
      alert('제목과 내용을 작성해주세요.');
    }
  }else{
    alert('로그인 해야합니다.');
  }
}

export function modifyTip(data,title,content) {
  const user = getCurrentUser();
  if(data.writer == user.uid){
    if(title && content && title !== '' && content != '' && content != '<p><br></p>' && content != '<h1><br></h1>' && content != '<h2><br></h2>'){
      let titleArray = [];
      title.split(' ').forEach(text=>{
        if(text != '' && text != ' '){
          titleArray.push(text)
        }
      })
      db.collection('post').doc(data.id).update({content:content,title:titleArray}).then(()=>{
        sessionStorage.removeItem('modify')
        for (var key in sessionStorage) {
          let sStorage = JSON.parse(sessionStorage.getItem(key))
          if(sStorage && typeof sStorage == 'object'){
            sStorage.forEach((doc,i)=>{
              if(doc.id === data.id){
                sStorage[i].content = content;
                sStorage[i].title = titleArray;
                sessionStorage.setItem(key,JSON.stringify(sStorage))
              }
            })
          }
        }
        alert('팁 수정 완료!');
        window.history.back()
      }).catch((err)=>{
        alert('팁 수정 실패\n' + err)
      })
    }
  }else{
    alert('내 팁이 아닙니다.')
  }
}