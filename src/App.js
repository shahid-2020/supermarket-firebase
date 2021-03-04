import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import AppContext from './context/AppContext';
import Authenticate_page from './components/pages/Authenticate_page';
import Error404_page from './components/pages/Error404_page';
import Form_page from './components/pages/Form_page';
import Seller_page from './components/pages/seller_page';

import Test from './containers/Seller';

function App() {
    return (
        <Router>
            <AppContext>
                <Switch>
                    <Route exact path="/" component={Authenticate_page} />
                    <Route path="/form" component={Form_page} />
                    <Route path="/seller" component={Seller_page}/>
                    <Route path='/test' component={Test} />
                    <Route component={Error404_page} />
                </Switch>
            </AppContext>
        </Router>

    );
}

export default App;
