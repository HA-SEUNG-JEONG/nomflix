import { BrowserRouter, Switch, Route } from "react-router-dom";
import Movie from "./Routes/Movies/Movie";
import { Tv } from "./Routes/Tv";
import { Search } from "./Routes/Search";
import Header from "./components/Header";

function App() {
  return (
    <>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Header />
        <Switch>
          {/* react-router가 두 개의 path에서 같은 component를 rendering 하도록 할 수 있음 */}
          <Route exact path={["/", "/movies/:movieId"]}>
            <Movie />
          </Route>
          <Route path="/tv">
            <Tv />
          </Route>
          <Route path="/search">
            <Search />
          </Route>
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;
