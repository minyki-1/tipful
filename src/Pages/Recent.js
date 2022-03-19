import styled from 'styled-components'
import Post from '../Components/Post'
import PostReady from '../Components/PostReady'
import {getRecentData,getDate} from '../firebase/firestore'
import { useEffect, useState } from 'react'

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

function Recent() {
  const sStorage = JSON.parse(sessionStorage.getItem('recent'))
  const [dataResult,setDataResult] = useState(sStorage && sStorage[0] > getDate() ? "noDelay" : false)
  useEffect(()=>{
    getRecentData().then((result)=>{setDataResult(result)})
  },[])

  return (
    <Container>
      {
        dataResult && dataResult != 'noDelay'
        ? dataResult.map((data,key)=>{
          return <Post key={key} data={data} />
        })
        : dataResult != 'noDelay' && 
        <><PostReady/><PostReady/><PostReady/></>
      }
      {
        dataResult &&
        dataResult.length % 2 == 1 &&
        <Stuff />
      }
    </Container>
  );
}

export default Recent;