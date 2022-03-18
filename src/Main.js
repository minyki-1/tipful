import styled from 'styled-components'
import Home from './Pages/Home';
import Write from './Pages/Write'
import { Route,Switch } from 'react-router-dom';

const Container = styled.div`
  width:100%;
  min-height:100%;
  height:auto;
  display: flex;
  align-items: center;
  flex-direction: column;
`

function Main() {
  return (
    <Container>
      <Switch>
        <Route path="/write" component={Write} />
        <Route path="/" component={Home} />
      </Switch>
    </Container>
  );
}

export default Main;
