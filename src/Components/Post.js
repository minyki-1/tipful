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
// import {ReactComponent as Svg_menu_row} from '../svg/menu_row.svg'

import {addLike,addBookmark,getDate} from '../firebase/firestore'

const Container = styled.div`
  width:calc(100% - 3.8rem);
  min-height:calc((100vw - 3.8rem) / 16 * 9);
  height:${(props)=>props.spread ? '100%' : 'calc((100vw - 3.8rem) / 16 * 9)'};
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
    height:${(props)=>props.spread ? '100%' : 'calc((100vw - 3.8rem) / 2 / 16 * 9)'};
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
  height:80%;
  width: 100%;
  overflow:hidden;
  margin-top: 6px;
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
    a{
      color: #3ea6ff;
    }
  }
`
const Title = styled.div`
  width:100%;
  overflow: hidden;
  text-overflow:ellipsis;
  font-size:20px;
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
const ProfileImg = styled.img`
  width:20px;
  height:20px;
  border-radius: 100px;
`
const ProfileText = styled.div`
  font-size:13px;
  margin-left:4px;
  margin-right:12px;
  color:#D0D0D0;
`
const LikeText = styled.div`
  font-size: 13px;
  color:#D0D0D0;
  margin-left:12px;
`

function Post({data}) {
  const contentValue = sessionStorage.getItem('text')
  const icon = { fill:'#EEEEEE', width:19, height:19, style:{padding:'4px',cursor:'pointer'}}
  const [spread,setSpread] = useState(false);
  const postRef = useRef()
  const contentRef = useRef()
  const [isLike,setIsLike] = useState(data.like)
  const [isBookmark,setIsBookmark] = useState(data.bookmark)

  useEffect(()=>{
    // console.log(data)

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
      addBookmark(isBookmark,data.id).then((result)=>{
        if(result) setIsBookmark(!isBookmark)
      })
    }
  }

  const likeOnClick = () => {
    if(sessionStorage.getItem('likeDelay') < getDate()){
      addLike(isLike,data.id).then((result)=>{
        if(result) setIsLike(!isLike)
      })
    }
  }

  useEffect(()=>{
    if(spread == true){   //페이지를 펼칠때 그 위치로 스크롤 이동
      const top = postRef.current.offsetTop;
      window.scrollTo({top:top - 20, behavior:'smooth'});
    }
  },[spread])

  return (
    <Container spread={spread} ref={postRef}>

      <Center>
        <CenterText>
          <Title>Title</Title>
          <Content ref={contentRef} dangerouslySetInnerHTML={ {__html: Dompurify.sanitize(contentValue)} }/>
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
          <Svg_menu_colum {...icon} />  
        </CenterIcon>
      </Center>

      <InformBar>
        <div style={{display:'flex',alignItems:'center'}}>
          <ProfileImg src="https://yt3.ggpht.com/yti/APfAmoHjR07qQc8HPLecMV7kPHu5zReL5cRHyDEklKf7Uw=s88-c-k-c0x00ffffff-no-rj-mo"/>
          <ProfileText>CWIN77</ProfileText>
          <span style={{width:4,height:4,boderRadius:10,backgroundColor:'#D0D0D0'}}/>
          <LikeText>
            좋아요 {
              data.like
              ? isLike ? data.likeCount : data.likeCount - 1
              : isLike ? data.likeCount + 1 : data.likeCount
            }개
          </LikeText>
        </div>
        {
          spread
          ? <Svg_arrow_up onClick={()=>{setSpread(false)}} {...icon} />
          : <Svg_arrow_down onClick={()=>{setSpread(true)}} {...icon} />
        }
      </InformBar>
      
    </Container>
  );
}

export default Post;
