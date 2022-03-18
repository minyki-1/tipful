import styled from 'styled-components'

const Container = styled.div`
  width:100%;
  min-height:100%;
  height:auto;
  display: flex;
  align-items: center;
  flex-direction: column;
`

function Home() {
  return (
    <Container>
      Bookmark
    </Container>
  );
}

export default Home;
