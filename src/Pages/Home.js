import styled from 'styled-components'
import Top from '../Components/Top'
import Navbar from '../Components/Navbar'
import { Route,Switch } from 'react-router-dom';
import Recent from '../Components/Recent'
import Popular from '../Components/Popular'
import Bookmark from '../Components/Bookmark'
import Search from '../Components/Search'

const Container = styled.div`
  width:100%;
  min-height:100%;
  height:auto;
  display: flex;
  align-items: center;
  flex-direction: column;
`
const RouterContainer = styled.div`
  display:flex;
  align-items:center;
  justify-content:center;
  width:100%;
`

function Home() {
  return (
    <Container>
      <Top />
      <Navbar />
      <RouterContainer>
        <Switch>
          <Route exact path="/" component={Popular} />
          <Route path="/recent" component={Recent} />
          <Route path="/bookmark" component={Bookmark} />
          <Route path="/search" component={Search} />
          <Route path="/">404 Not Found</Route>
        </Switch>
      </RouterContainer>
    </Container>
  );
}

export default Home;
