import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {Layout} from 'antd';
import styles from './app.scss';
import HeaderComponent from './components/Layout/Header';

const {Header, Content} = Layout;

import Home from './Index/home';
import About from './Index/about';
import Feedback from './Index/feedback';
import NotFound from './NotFound';
import Login from './Login';
import Register from './Register';

const App = () => {
    return (
        <Router>
            <Switch>
                <Route path={'/login'} exact component={Login} />
                <Route path={'/register'} exact component={Register} />

                <Route path={'/'}>
                    <Layout style={{height: '100%'}}>
                        <Header className={styles['header']}>
                            <HeaderComponent />
                        </Header>
                        <Content className={styles['content']}>
                            <Switch>
                                <Route path={'/'} exact component={Home} />
                                <Route path={'/about'} exact component={About} />
                                <Route path={'/feedback'} exact component={Feedback} />

                                <Route path={'/*'} component={NotFound} />
                            </Switch>
                        </Content>
                    </Layout>
                </Route>
            </Switch>
        </Router>
    );
};

export default App;