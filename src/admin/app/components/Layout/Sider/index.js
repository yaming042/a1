import React from 'react';
import {withRouter} from 'react-router-dom';
import {Menu} from 'antd';
import IconSvg from '@commonUtils/IconSvg';
import styles from './index.scss';
import config from './../../../config';

class Sider extends React.Component{
    constructor(props) {
        super(props);

        const openKeys = this.getOpenKey(location.pathname);
        this.state = {
            selectedKeys: location.pathname || undefined,
            // 这里遇到了个状态问题，默认是undefined，did mount后改变值，menu的展开菜单并不会变，所以才加个loading来刷新状态
            openKeys: openKeys,
        };
    }

    componentDidMount() {
        const {history} = this.props;
        history.listen((params) => {
            const {pathname} = params;
            const openKeys = this.getOpenKey(pathname);
            this.setState({
                selectedKeys: pathname,
                openKeys,
            });
        })
    }

    // 点击菜单
    handleClick = ({key, keyPath, domEvent}) => {
        const {history} = this.props;
        history.push(key);
    };

    // 根据pathname获取需要打开的 父菜单
    getOpenKey(pathname='') {
        const {webConfig: {baseUrl}} = config;
        const reg = new RegExp(baseUrl, 'g');
        const paths = pathname.split('/');
        paths.pop();

        let keys = paths.reduce((total, current) => {
            let prevKeys = total[total.length-1] || '';
            return total.concat(`${prevKeys ? '/'+prevKeys+'/' : ''}${current}`);
        }, []).slice(2); // 前两个没用

        return keys.length ? keys.filter(i => !!i) : undefined;
    }

    render() {
        const {selectedKeys, openKeys} = this.state;

        return (
            <div className={styles['sider-menu']}>
                <div className={styles['logo']}>
                    <h3>
                        <IconSvg name="icon-apps-2" />AnyOne
                    </h3>
                </div>
                <div className={styles['menu']}>
                    <Menu
                        inlineIndent={12}
                        className={styles['menu-list']}
                        onClick={this.handleClick}
                        selectedKeys={selectedKeys}
                        defaultOpenKeys={openKeys || undefined}
                        mode="inline"
                        triggerSubMenuAction="click"
                        items={config.menuConfig || []}
                    />
                </div>
            </div>
        );
    }
}

export default withRouter(Sider);
