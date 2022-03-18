import styled from 'styled-components'
import Top from '../Components/Top'
import Navbar from '../Components/Navbar'

const Container = styled.div`
  width:100vw;
  min-height:100vh;
  height:auto;
  display: flex;
  align-items: center;
  flex-direction: column;
`

function Search() {
  return (
    <Container>
      <Top />
      <Navbar />
    </Container>
  );
}

export default Search;
