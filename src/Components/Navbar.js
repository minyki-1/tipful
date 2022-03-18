import styled from 'styled-components'
import {ReactComponent as Svg_check} from '../svg/check.svg'
import {ReactComponent as Svg_clock} from '../svg/clock.svg'
import {ReactComponent as Svg_bookmark} from '../svg/bookmark.svg'
import {ReactComponent as Svg_search} from '../svg/search.svg'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const Container = styled.div`
  width:calc(100% - 2rem);
  display: flex;
  align-items: center;
  margin: 1rem;
  *{
    text-decoration: none;
  }
`
const NavBtn = styled.button`
  display:flex;
  align-items: center;
  outline:none;
  border:none;
  padding: 0px;
  margin-right:10px;
  margin-left: 2px;
  border-bottom: ${(props) => props.page ? '3px solid white' : 'none'};
  cursor: pointer;
`
const NavTxt = styled.p`
  font-size: 15px;
  margin: 6px;
  font-weight: ${(props) => props.page ? 'bold' : '400'};
  margin-bottom: 6px;
  color : ${(props) => props.page ? 'white' : '#B7B7B7'};
`

function Navbar() {
  const [page,setPage] = useState(window.location.pathname);
  const svg = {width:16,height:16};
  return (
    <Container>
      <Link to="/" onClick={()=>{setPage('/')}}>
        <NavBtn page={page == '/'}>
          <Svg_check {...svg} fill={page == '/' ? 'white' : '#B7B7B7'} /><NavTxt page={page == '/'}>인기팁</NavTxt>
        </NavBtn>
      </Link>
      <Link to="/recent" onClick={()=>{setPage('/recent')}}>
        <NavBtn page={page == '/recent'}>
        <Svg_clock {...svg} fill={page == '/recent' ? 'white' : '#B7B7B7'} /><NavTxt page={page == '/recent'}>최신팁</NavTxt>
        </NavBtn>
      </Link>
      <Link to="/bookmark" onClick={()=>{setPage('/bookmark')}}>
        <NavBtn page={page == '/bookmark'}>
          <Svg_bookmark {...svg} fill={page == '/bookmark' ? 'white' : '#B7B7B7'} /><NavTxt page={page == '/bookmark'}>저장팁</NavTxt>
        </NavBtn>
      </Link>
      <Link to="/search" onClick={()=>{setPage('/search')}}>
        <NavBtn page={page == '/search'}>
          <Svg_search {...svg} fill={page == '/search' ? 'white' : '#B7B7B7'} /><NavTxt page={page == '/search'}>검색팁</NavTxt>
        </NavBtn>
      </Link>
    </Container>
  );
}

export default Navbar;
