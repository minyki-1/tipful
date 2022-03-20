import styled from 'styled-components'
import Dompurify from "dompurify"
import { useEffect, useRef, useState } from 'react'
import {ReactComponent as Svg_bookmark} from '../svg/bookmark.svg'
import {ReactComponent as Svg_bookmark_fill} from '../svg/bookmark_fill.svg'
import {ReactComponent as Svg_arrow_down} from '../svg/arrow_down.svg'
import {ReactComponent as Svg_arrow_up} from '../svg/arrow_up.svg'
import {ReactComponent as Svg_heart} from '../svg/heart.svg'
import {ReactComponent as Svg_heart_fill} from '../svg/heart_fill.svg'
import {ReactComponent as Svg_menu_colum} from '../svg/menu_colum.svg'
import {ReactComponent as Svg_report} from '../svg/report.svg'
import {ReactComponent as Svg_postPlus} from '../svg/postPlus.svg'

import {editLike,editBookmark,getDate,getUserData,modifyTip,getCurrentUser} from '../firebase/firestore'

import { Link } from 'react-router-dom'

const Container = styled.div`
  width:calc(100% - 3.8rem);
  min-height:calc((100vw - 3.8rem) / 16 * 9);
  height:${(props)=>props.isSpread ? '100%' : 'calc((100vw - 3.8rem) / 16 * 9)'};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #1E1E1E;
  border-radius: 4px;
  padding: 0.9rem;
  padding-top: 0.7rem;
  margin: 1rem;
  @media only screen and (min-width:760px) {
    margin-right:0px;
    margin-bottom: 0px;
    width: calc(50% - 3.8rem);
    min-height:calc((100vw - 3.8rem) / 2 / 16 * 9);
    height:${(props)=>props.isSpread ? '100%' : 'calc((100vw - 3.8rem) / 2 / 16 * 9)'};
  }
  *{
    background-color: #1E1E1E;
  }
`
const Center = styled.div`
  display:flex;
  width:100%;
  height:80%;
  justify-content:space-between;
`
const CenterText = styled.div`
  display:flex;
  flex-direction:column;
  width:100%;
  height:100%;
  overflow:hidden;
`
const CenterIcon = styled.div`
  display:flex;
  flex-direction:column;
  align-items:center;
`
const Content = styled.div`
  background-color: initial;
  height:calc(100% - 6px);
  width: calc(100% - 6px);
  padding: 3px;
  overflow:hidden;
  margin-top: 4px;
  h1{
    font-size: 18px;
    font-weight:400;
    strong{
      font-weight:bold;
    }
    a{
      text-decoration:none;
    }
  }
  h2{
    font-size: 16px;
    font-weight:400;
    strong{
      font-weight:bold;
    }
    a{
      text-decoration:none;
    }
  }
  p{
    font-size: 14px;
    font-weight:400;
    strong{
      font-weight:bold;
    }
    a{
      text-decoration:none;
    }
  }
  *{
    font-size: 14px;
    margin-top:0px;
    margin-bottom:0px;
    color: ${(props)=>props.isSpread ? "#ececec" : '#B4B4B4'};
    padding-bottom:${(props)=>props.isSpread ? "2px" : '0px'};
    a{
      color: #3ea6ff;
    }
  }
`
const Title = styled.div`
  width:100%;
  height:auto;
  display: flex;
  overflow: hidden;
  text-overflow:ellipsis;
  font-size:18px;
  padding-bottom: 2px;
`
const InformBar = styled.div`
  height:20px;
  padding-top: 8px;
  margin-top:8px;
  display: flex;
  justify-content: space-between;
  align-items:center;
  border-top: 2px solid #2D2D2D;
`
const DateText = styled.div`
  font-size:12.25px;
  margin-right:4px;
  color:#D0D0D0;
`
const LikeText = styled.div`
  font-size: 12.25px;
  color:#D0D0D0;
`
const Modal = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  min-width:120px;
  background-color: #111111;
  padding: 4px;
  box-shadow: 0px 4px 20px 8px rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.1);
  right:25px;
  margin-top: 110px;
  border-radius: 4px;
  z-index: 10;
  *{
    background-color: #111111;
    text-decoration: none;
  }
`
const ModalLine = styled.div`
  display:flex;
  align-items: center;
  cursor: pointer;
  padding: 6px;
  margin: 2px;
`
const ModalText = styled.div`
  font-size: 14.5px;
  margin-left: 6px;
`
const ProfileImg = styled.img`
  width:24px;
  height:24px;
  border-radius: 100px;
  padding: 2px;
  cursor: pointer;
`

function Post({data}) {
  const user = JSON.parse(localStorage.getItem('user'))
  const icon = { fill:'#EEEEEE', width:19, height:19, style:{padding:'4px',cursor:'pointer'}}
  const [isSpread,setIsSpread] = useState(false);
  const postRef = useRef()
  const contentRef = useRef()
  const [isLike,setIsLike] = useState(data.like)
  const [isBookmark,setIsBookmark] = useState(data.bookmark)
  const [isModal, setIsModal] = useState(false);
  const [writer,setWriter] = useState(false);

  useEffect(()=>{
    contentRef.current.childNodes.forEach((node)=>{   // 태그 인 스타일을 제거
      node.removeAttribute('style')
      node.childNodes.forEach((elem)=>{
        if(elem.hasChildNodes()){
          elem.removeAttribute('style')
        }
      })
    })
  },[contentRef])

  const bookmarkOnClick = () => {
    if(sessionStorage.getItem('bookmarkDelay') < getDate()){
      editBookmark(isBookmark,data.id).then((result)=>{
        if(result) setIsBookmark(!isBookmark)
      })
    }
  }

  const likeOnClick = () => {
    if(sessionStorage.getItem('likeDelay') < getDate()){
      editLike(isLike,data.id).then((result)=>{
        if(result) setIsLike(!isLike)
      })
    }
  }

  useEffect(()=>{
    if(isSpread == true){   //페이지를 펼칠때 그 위치로 스크롤 이동
      const top = postRef.current.offsetTop;
      window.scrollTo({top:top - 20, behavior:'smooth'});
    }
  },[isSpread])

  return (
    <Container isSpread={isSpread} ref={postRef}>
      <Center>
        <CenterText>
          <Title>{data.title.join(' ')}</Title>
          <Content isSpread={isSpread} ref={contentRef} dangerouslySetInnerHTML={ {__html: Dompurify.sanitize(data.content)} }/>
        </CenterText>
        <CenterIcon>
          {
            isBookmark
            ? <Svg_bookmark_fill onClick={()=>{bookmarkOnClick()}} {...icon} />
            : <Svg_bookmark onClick={()=>{bookmarkOnClick()}} {...icon} />
          }
          <span style={{marginTop:12}} />
          {
            isLike
            ? <Svg_heart_fill onClick={()=>{likeOnClick()}} {...icon} />
            : <Svg_heart onClick={()=>{likeOnClick()}} {...icon} />
          }
          <span style={{marginTop:12}} />
          <Svg_menu_colum onClick={()=>{
            setIsModal(!isModal); 
            getUserData(data.writer).then(result=>{setWriter(result)})
          }} {...icon} />
        </CenterIcon>
        {
          isModal &&
          <Modal>
            {
              writer &&
              <ModalLine>
                <ProfileImg src={writer.photoURL} />
                <ModalText>{writer.displayName}</ModalText>
              </ModalLine>
            }
            {
              user &&
              user.uid == writer.id &&
              <Link to="/modify" onClick={()=>{sessionStorage.setItem('modify',JSON.stringify(data))}}>
                <ModalLine>
                  <Svg_postPlus {...icon} />
                  <ModalText>수정하기</ModalText>
                </ModalLine>
              </Link>
            }
            <ModalLine>
              <Svg_report {...icon} />
              <ModalText>신고하기</ModalText>
            </ModalLine>
          </Modal>
        }
      </Center>

      <InformBar>
        <div style={{display:'flex',alignItems:'center'}}>
          <LikeText>
            좋아요 {
              data.like
              ? isLike ? data.likeCount : data.likeCount - 1
              : isLike ? data.likeCount + 1 : data.likeCount
            }개
          </LikeText>
          <span style={{width:4,height:4,borderRadius:10,margin:10,backgroundColor:'#D0D0D0'}}/>
          <DateText>20{String(data.date).slice(0,2)}년 {String(data.date).slice(2,4)}월 {String(data.date).slice(4,6)}일</DateText>
        </div>
        {
          isSpread
          ? <Svg_arrow_up onClick={()=>{setIsSpread(false)}} {...icon} />
          : <Svg_arrow_down onClick={()=>{setIsSpread(true)}} {...icon} />
        }
      </InformBar>
      
    </Container>
  );
}

export default Post;
