import React from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {Layout, Spin, message} from 'antd';
import styles from './app.scss';
import SiderComponent from './components/Layout/Sider';
import HeaderComponent from './components/Layout/Header';
import request from '@commonUtils/request';

const {Header, Sider, Content} = Layout;
import config from './config';

import Login from './Pages/Login';
import NotFound from '@commonUtils/NotFound';
import Forbidden from '@commonUtils/Forbidden';

const AdminLayout = (props) => {
    const {loading, collapsed, routers=[]} = props || {};

    return (
        <Layout style={{height: '100%'}}>
            {loading ? (
                <div className={styles['loading']}>
                    <Spin tip="应用加载中，请稍等 ~"></Spin>
                </div>
            ) : null}

            <Sider trigger={null} collapsible collapsed={collapsed}>
                <SiderComponent callback={() => {}} />
            </Sider>
            <Layout>
                <Header className={styles['header']}>
                    <HeaderComponent />
                </Header>
                <Content className={styles['content']}>
                    <Switch>
                        {
                            routers.map((item, k) => {
                                return (
                                    <Route key={item.id} path={item.key} component={ item.component } />
                                );
                            })
                        }
                    </Switch>
                </Content>
            </Layout>
        </Layout>
    );
};

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            routers: [],
            appLoading: true,
        };
    }

    componentDidMount() {
        this.initApp().then(response => {
            this.setState({appLoading: false});
            if(response && response.status === 0) {
                this.setState({
                    routers: (config.routeConfig || []).slice(0)
                });
            }
        }).catch(error => {
            this.setState({appLoading: false});
        });
    }

    // 初始化应用，请求权限相关的数据
    initApp() {
        const {pathname} = location;
        return new Promise((resolve, reject) => {
            if(pathname.indexOf('/login') === 0) {
                return resolve(null);
            }
            request(`/validate`).then(response => {
                resolve(response);
            }).catch(error => {
                message.error(error.message);
            });
        });
    }

    render() {
        const {appLoading, routers} = this.state;
        const {collapsed} = this.props;
        const {webConfig: {baseUrl=''}} = config || {};

        const adminProps = {loading: appLoading, routers, collapsed};

        return (
            <>
                {
                    appLoading ?
                        null
                        :
                        <Router>
                            <Switch>
                                <Route path="/login" exact component={Login} />
                                <Route path="/404" exact component={NotFound} />
                                <Route path="/403" exact component={Forbidden} />
                                <Redirect exact path={`${baseUrl}/`} to={`${baseUrl}/users`} />
                                <Route path={baseUrl} render={props => <AdminLayout {...props} {...adminProps} />} />
                            </Switch>
                        </Router>
                }
            </>
        );
    }
}

function mapStateToProps(state) {
    const {collapsed} = state.main;
    return {
        collapsed: collapsed
    };
}
export default connect(mapStateToProps, null)(App);