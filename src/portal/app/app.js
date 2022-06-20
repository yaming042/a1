import React from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import {Layout, Spin} from 'antd';
// import history from './../utils/history'; // 使用的browserRouter就不需要history
import store from '../store';
import {SET_BIZ_ID, SET_AUTH_RESOURCE, SET_BIZ_DATA} from '../utils/constant';
import styles from './app.scss';
import SiderComponent from './components/Layout/Sider';
import HeaderComponent from './components/Layout/Header';
import {CookieUtil} from '../utils/utils';
import request from './../utils/request';

const {Header, Sider, Content} = Layout;
import {config} from './config';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            routers: [],
            appLoading: false,
        };
    }

    componentDidMount() {
        this.setState({
            routers: (config || []).filter(i => i.component).slice(0)
        });
    }

    // 初始化应用，请求权限相关的数据
    async initApp() {}

    render() {
        const {appLoading, routers} = this.state;
        const {collapsed} = this.props;

        return (
            <Router>
                <Layout style={{height: '100%'}}>
                    {appLoading ? (
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
                                            <Route key={item.id} path={item.path} component={ item.component } />
                                        );
                                    })
                                }
                            </Switch>
                        </Content>
                    </Layout>
                </Layout>
            </Router>
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