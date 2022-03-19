import styled from 'styled-components'

const Container = styled.div`
  width:100%;
  height:100%;
  display: flex;
`
const Notice = styled.div`
  width:100%;
  height:70vh;
  display:flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  *{
    line-height: 30px;
    font-size: 16px;
    color:#D71010;
  }
`

function Post() {
  return (
    <Container >
      <Notice><span>페이지가 존재하지 않습니다.</span><span>404 Not Found !</span></Notice>
    </Container>
  );
}

export default Post;
