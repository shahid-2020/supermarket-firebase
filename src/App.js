import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import AppContext from './context/AppContext';
import Error404_page from './components/pages/Error404_page';
import Construction_page from './components/pages/Construction_page';
import Authenticate_page from './components/pages/Authenticate_page';
import Form_page from './components/pages/Form_page';
import Seller_page from './components/pages/Seller_page';
import Shop_page from './components/pages/Shop_page';
import Buyer_page from './components/pages/Buyer_page';

import Test from './containers/Header.jsx';

function App() {
    return (
        <Router>
            <AppContext>
                <Switch>
                    <Route exact path="/" component={Authenticate_page} />
                    <Route path="/form" component={Form_page} />
                    <Route path="/seller/:shopId" component={Shop_page}/>
                    <Route path="/seller" component={Seller_page}/>
                    <Route path="/buyer" component={Buyer_page}/>
                    <Route path='/test' component={Test} />
                    <Route path='/page-under-construction' component={Construction_page} />
                    <Route component={Error404_page} />
                </Switch>
            </AppContext>
        </Router>

    );
}

export default App;
