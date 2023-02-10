import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import Home from './Index/home';
import NotFound from './NotFound';
import Register from './Register';

const App = () => {
    return (
        <Router>
            <Switch>
                <Route path={'/register'} exact component={Register} />
                <Route path={'/'} exact component={Home} />
                <Route component={NotFound} />
            </Switch>
        </Router>
    );
};

export default App;