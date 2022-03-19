import styled from 'styled-components'
import Post from '../Components/Post'
import PostReady from '../Components/PostReady'
import {getBookmarkData,getDate} from '../firebase/firestore'
import { useEffect, useState } from 'react'

const Container = styled.div`
  width:100%;
  height:100%;
  display: flex;
  flex-wrap: wrap;
`
const Stuff = styled.div`
  @media only screen and (min-width:760px) {
    width: calc(50% - 2rem - 1.5rem);
    height:${(props)=>props.isSpread ? '100%' : 'calc((50vw - 3.36rem) / 16 * 9)'};
    background-color: initial;
    padding: 0.75rem;
    padding-top: 0.6rem;
    margin: 1rem;
  }
`
const Notice = styled.div`
  width:100%;
  height:70vh;
  display:flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  opacity: 0.6;
`

function Bookmark() {
  const bookmarkStorage = JSON.parse(sessionStorage.getItem('bookmark'))
  const user = JSON.parse(localStorage.getItem('user'))
  const [dataResult,setDataResult] = useState(bookmarkStorage && bookmarkStorage[0] > getDate() ? "noDelay" : false)
  useEffect(()=>{
    getBookmarkData().then((result)=>{setDataResult(result)})
  },[])

  return (
    <Container>
      {
        user
        ? dataResult && dataResult != 'noDelay'
          ? dataResult.length > 0
            ? dataResult.map((data,key)=>{
              return <Post key={key} data={data} />
            })
            : <Notice>북마크한 게시물이 없습니다.</Notice>
          : dataResult != 'noDelay' &&
          <><PostReady/><PostReady/><PostReady/><PostReady/><PostReady/><PostReady/><PostReady/><PostReady/><PostReady/><PostReady/><PostReady/><PostReady/></>
        : <Notice>로그인 후 북마크가 가능합니다.</Notice>
      }
      {
        dataResult &&
        dataResult.length % 2 == 1 &&
        <Stuff />
      }
    </Container>
  );
}

export default Bookmark;