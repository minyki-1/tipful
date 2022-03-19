import styled from 'styled-components'
import Top from '../Components/Top'
import Navbar from '../Components/Navbar'
import { Route,Switch } from 'react-router-dom';
import Recent from './Recent'
import Popular from './Popular'
import Bookmark from './Bookmark'
import Search from './Search'
import Error404 from './Error404'

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
          <Route path="/" component={Error404} />
        </Switch>
      </RouterContainer>
    </Container>
  );
}

export default Home;
