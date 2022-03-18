import styled from 'styled-components'

const Container = styled.div`
  width:calc(100% - 3.5rem);
  min-height:calc((100vw - 4rem) / 16 * 9);
  height:calc((100vw - 4rem) / 16 * 9);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #1E1E1E;
  border-radius: 4px;
  padding: 0.75rem;
  padding-top: 0.6rem;
  margin: 1rem;
  @media only screen and (min-width:760px) {
    margin-right:0px;
    margin-bottom: 0px;
    width: calc(50% - 3rem);
    min-height:calc((100vw - 4rem) / 2 / 16 * 9);
    height:calc((100vw - 4rem) / 2 / 16 * 9);
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
const Title = styled.div`
  width:170px;
  height:26px;
  margin: 2px;
  margin-top: 4px;
  background-color: #363636;
  border-radius: 4px;
`
const Icon = styled.span`
  width:19px;
  height:19px;
  padding: 4px;
  border-radius: 100px;
  margin-top: 4px;
  margin-left: 4px;
  margin-bottom: 16px;
  background-color: #363636;
`

function Post() {
  return (
    <Container>

      <Center>
        <CenterText>
          <Title/>
        </CenterText>
        <CenterIcon>
          <Icon/>
          <Icon/>
        </CenterIcon>
      </Center>

    </Container>
  );
}

export default Post;
