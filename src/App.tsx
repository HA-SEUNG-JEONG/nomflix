import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Routes/Home";
import Tv from "./Routes/Tv";
import Search from "./Routes/Search";
import Header from "./components/Header";

function App() {
  return (
    <Router>
      <Header />
      <Switch>
        {/* react-router가 두 개의 path에서 같은 component를 rendering 하도록 할 수 있음 */}
        <Route path={["/","/movies/:movieId"]}> 
          <Home />
        </Route>
        <Route path="/tv">
          <Tv />
        </Route>
        <Route path="/search">
          <Search />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
