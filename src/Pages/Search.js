import styled from 'styled-components'
import Post from '../Components/Post'
import {getSearchData} from '../firebase/firestore'
import { useEffect, useState } from 'react'
import {ReactComponent as Svg_search} from '../svg/search.svg'

const Container = styled.div`
  width:100%;
  display: flex;
  justify-content: center;
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
const SearchContainer = styled.div`
  display:flex;
  width:calc(100% - 2rem);
  margin: 1rem;
  max-width: 600px;
`
const SearchBar = styled.input`
  width:100%;
  border: none;
  outline: none;
  border: 2px solid rgba(255,255,255,0.5);
  padding: 0.8rem;
  font-size: 15px;
`
const SearchBtn = styled.button`
  cursor: pointer;
  width:70px;
  height:100%;
  padding: 0.8rem;
  border: none;
  outline: none;
  border: 2px solid rgba(255,255,255,0.5);
  border-left: 0px;
`

function Search() {
  const [dataResult,setDataResult] = useState(false)
  const [keyword,setKeyword] = useState('')

  return (
    <Container>
      <SearchContainer>
        <SearchBar placeholder='검색어를 입력해주세요' type={'text'} value={keyword} onChange={(e)=>{setKeyword(e.target.value)}} onKeyUp={(e)=>{if(e.keyCode == 13){getSearchData(keyword).then((result)=>{setDataResult(result)})}}} />
        <SearchBtn onClick={()=>{getSearchData(keyword).then((result)=>{setDataResult(result)})}}><Svg_search width={20} height={20} fill={'white'} /></SearchBtn>
      </SearchContainer>
      {
        dataResult &&
        dataResult.map((data,key)=>{
          return <Post key={key} data={data} />
        })
      }
      {
        dataResult &&
        dataResult.length % 2 == 1 &&
        <Stuff />
      }
    </Container>
  );
}

export default Search;