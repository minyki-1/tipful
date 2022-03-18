import styled from 'styled-components'
import { Link } from 'react-router-dom'
import {ReactComponent as Svg_profile} from '../svg/profile.svg'
import {ReactComponent as Svg_signOut} from '../svg/signOut.svg'
import {ReactComponent as Svg_myTips} from '../svg/myTips.svg'
import {ReactComponent as Svg_postPlus} from '../svg/postPlus.svg'
import {ReactComponent as Svg_googleIcon} from '../svg/googleIcon.svg'
import {ReactComponent as Svg_crossLine} from '../svg/crossLine.svg'

import { signIn,signOut } from '../firebase/firestore'
import { useEffect, useState } from 'react'

const Container = styled.div`
  width:calc(100% - 2rem);
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 1rem;
  margin-top: 12px;
  margin-bottom: 12px;
`
const Logo = styled.div`
  display: flex;
  font-size: 1.25rem;
  cursor: pointer;
`
const Profile = styled.img`
  border-radius: 100px;
  width: 36px;
  height:36px;
  margin: 4px;
  margin-left: 8px;
  padding: 4px;
  cursor: pointer;
`
const ProfileModal = styled.span`
  position: absolute;
  width:152px;
  background-color: #222222;
  padding: 8px;
  box-shadow: 0px 4px 20px 8px rgba(0, 0, 0, 0.25);
  right:20px;
  top:64px;
  border-radius: 4px;
  *{
    background-color: #222222;
    text-decoration: none;
  }
`
const ModalLine = styled.div`
  display:flex;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  margin: 2px;
`
const ModalText = styled.div`
  font-size: 16px;
  margin-left: 6px;
`
const AuthModalBackgorund = styled.div`
  position: absolute;
  width:100%;
  height:100vh;
  background-color: rgba(0,0,0,0.6);
  left: 0px;
  top: 0px;
  display:flex;
  align-items: center;
  justify-content: center;
`
const AuthModal = styled.div`
  display: flex;
  width:360px;
  height:225px;
  border-radius: 4px;
  *{
    background-color: initial;
  }
`
const AuthModalSignIn = styled.div`
  width:100%;
  height:100%;
  background-color: #222222;
  display:flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
` 
const AuthModalSignInBtn = styled.div`  
  width:40px;
  height:40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border-radius: 100px;
`
const AuthModalSignInText = styled.span`
  width:auto;
  height:50px;
  font-size: 18px;
  font-weight: 600;
`
const AuthModalExplane = styled.div`
  width:calc(240% - 24px);
  height:calc(100% - 24px);
  padding: 12px;
  background-color: #1B1B1B;
  display:flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-end;
  *{
    margin-left: 24px;
    font-size: 18px;
    line-height:34px;
  }
` 

const svg = {width:20,height:20,fill:'#ECECEC',style:{padding:'4px',backgroundColor:'initial'}}

function Nav() {
  const user = JSON.parse(localStorage.getItem('user'))
  const [onModal,setOnModal] = useState(false)
  return (
    <Container>
      <Logo>TipFul</Logo>
      <div style={{display:'flex',alignItems:'center'}}>
        {
          user
          ? <Profile onClick={()=>{setOnModal(!onModal)}} src={user.photo}/>
          : <Svg_profile onClick={()=>{setOnModal(!onModal)}} width={32} height={32} style={{padding:4,margin:4,cursor:'pointer'}} />
        }
      </div>
      {
        onModal ?
          user
          ? <ProfileModal>
              <ModalLine onClick={()=>{}}>
                <Svg_myTips {...svg} />
                <ModalText>내 팁 보기</ModalText>
              </ModalLine>
              <Link to="/write">
                <ModalLine onClick={()=>{}}>
                  <Svg_postPlus {...svg} />
                  <ModalText>새 팁 작성</ModalText>
                </ModalLine>
              </Link>
              <ModalLine onClick={()=>{signOut()}}>
                <Svg_signOut {...svg} />
                <ModalText>로그아웃</ModalText>
              </ModalLine>
            </ProfileModal>
          : <AuthModalBackgorund>
              <AuthModal>
                <AuthModalSignIn>
                  <AuthModalSignInText>로그인</AuthModalSignInText>
                    <AuthModalSignInBtn onClick={()=>{signIn()}}>
                      <Svg_googleIcon {...svg} />
                    </AuthModalSignInBtn>
                  <AuthModalSignInText/>
                </AuthModalSignIn>
                <AuthModalExplane>
                  <Svg_crossLine onClick={()=>{setOnModal(!onModal)}} style={{padding:8}} width={18} height={18} fill={'#7C7C7C'} />
                  <div style={{marginRight:35}}>로그인 하고<br/>좋아요와 북마크<br/>게시글을 작성해보세요!</div>
                  <div style={{height:18,padding:8}} />
                </AuthModalExplane>
              </AuthModal>
            </AuthModalBackgorund>
        : null
      }
    </Container>
  );
}

export default Nav;
