import styled from 'styled-components'
import Quill from '../Components/Quill';
// import Draft from '../Components/Draft'

const Container = styled.div`
  width:100vw;
  min-height:100vh;
  height:auto;
  display: flex;
  align-items: center;
  flex-direction: column;
`

function Write() {
  return (
    <Quill></Quill>
    // <Container>
    //   <Draft></Draft>
    // </Container>
  )
}

export default Write;
