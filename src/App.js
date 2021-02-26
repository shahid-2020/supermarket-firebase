import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import AppContext from './context/AppContext';
import Authenticate_page from './components/pages/Authenticate_page';

function App() {
    return (
        <AppContext>
            <Router>
                <Switch>
                    <Route exact path="/" component={Authenticate_page} />
                </Switch>
            </Router>
        </AppContext>
    );
}

export default App;
