import styled from 'styled-components'
import Post from '../Components/Post'
import PostReady from '../Components/PostReady'
import {getMyPostData,getDate} from '../firebase/firestore'
import { useEffect, useState } from 'react'
import {ReactComponent as Svg_arrow_left} from '../svg/arrow_left.svg'

const Container = styled.div`
  width:100%;
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
const UserWrapper = styled.div`
  width:100%;
  display:flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 0px;
  margin-bottom: 0.5rem;
`
const UserNameText = styled.div`
  font-size: 22px;
  margin-top: 2px;
`
const UserPhotoImg = styled.img`
  width: 56px;
  height:56px;
  border-radius: 100px;
`
const OutBtn = styled.button`
  display:flex;
  align-items: center;
  border: none;
  outline:none;
  cursor: pointer;
  margin: 1rem;
  margin-top: 1rem;
  margin-bottom: 0px;
  font-size: 16px;
  padding: 6px;
  opacity: 0.8;
`

function Mytip() {
  const sStorage = JSON.parse(sessionStorage.getItem('mypost'))
  const [dataResult,setDataResult] = useState(sStorage && sStorage[0] > getDate() ? "noDelay" : false)
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(()=>{
    getMyPostData().then((result)=>{setDataResult(result)})
  },[])

  return (
    <Container>
      <OutBtn onClick={()=>{window.history.back();}}>
        <Svg_arrow_left width={16} height={16} fill="white" style={{marginRight:6}} />
        나가기
      </OutBtn>
      <UserWrapper>
        <UserPhotoImg src={user.photoURL} />
        <UserNameText>{user.displayName}</UserNameText>
      </UserWrapper>
      {
        dataResult && dataResult != 'noDelay'
        ? dataResult.map((data,key)=>{
          return <Post key={key} data={data} />
        })
        : dataResult != 'noDelay' && 
        <><PostReady/><PostReady/><PostReady/><PostReady/><PostReady/><PostReady/><PostReady/><PostReady/><PostReady/><PostReady/><PostReady/><PostReady/></>
      }
      {
        dataResult &&
        dataResult.length % 2 == 1 &&
        <Stuff />
      }
    </Container>
  );
}

export default Mytip;