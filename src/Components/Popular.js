import styled from 'styled-components'
import Post from './Post'
import PostReady from './PostReady'
import {getPopularData} from '../firebase/firestore'
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

function Popular() {
  const [dataResult,setDataResult] = useState(undefined)
  useEffect(()=>{
    getPopularData().then((result)=>{setDataResult(result)})
  },[])

  return (
    <Container dataResult={dataResult}>      
      {
        dataResult
        ? dataResult.map((data,key)=>{
          return <Post key={key} data={data} />
        })
        : <><PostReady/><PostReady/><PostReady/></>
      }
      {
        dataResult &&
        dataResult.length % 2 == 1 &&
        <Stuff />
      }
    </Container>
  );
}

export default Popular;