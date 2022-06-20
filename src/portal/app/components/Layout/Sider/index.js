import React from 'react';
import {Link} from 'react-router-dom';
import {Menu, Skeleton} from 'antd';
import styles from './index.scss';
import {menuConfig} from './../../../config/index';

const {SubMenu} = Menu;

class Comp extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            selectedKeys: [],
            // 这里遇到了个状态问题，默认是undefined，did mount后改变值，menu的展开菜单并不会变，所以才加个loading来刷新状态
            openKeys: undefined,
            loading: true,
        };
    }

    componentDidMount() {
        this.setMenu(location.pathname);
        this.setState({
            loading: false
        });
    }

    // 设置打开，选中的菜单
    setMenu = (pathname = '') => {
        const paths = pathname.split('/').filter((item) => !!item);

        paths.pop();
        // a/b/c => a, a/b
        const keys = paths.reduce((total, pre) => {
            const v = (total.slice(0).pop() || '') + '/' + pre;
            return total.concat([v]);
        }, []);
        this.setState({
            selectedKeys: [pathname],
            openKeys: keys
        });
    };

    onClose = () => {
        const {callback} = this.props;
        callback && callback();
    };

    // 渲染菜单
    renderMenu = (data=[]) => {
        return data.map((item) => {
            let element;
            // 菜单的key是path上最后一个字段
            // let currentKey = item.path.split('/').pop();
            let currentKey = item.path;

            if (item.children && item.children.length) {
                element = (
                    <SubMenu
                        key={currentKey}
                        icon={<span className={`iconfont ${item.icon || 'icon-rulengine'}`}></span>}
                        title={item.name}
                    >
                        {this.renderMenu(item.children)}
                    </SubMenu>
                );
            } else {
                element = (
                    <Menu.Item key={currentKey} icon={<span className={`iconfont ${item.icon || 'icon-rulengine'}`}></span>}>
                        <Link to={item.path}>{item.name}</Link>
                    </Menu.Item>
                );
            }

            return element;
        });
    };

    // 点击菜单
    handleClick = ({key, keyPath, domEvent}) => {
        this.onClose();
        this.setMenu(key);
    };

    render() {
        const {selectedKeys, openKeys, loading} = this.state;

        return (
            <div className={styles['sider-menu']}>
                <div className={styles['logo']}>
                    <h3>
                        <i className="iconfont icon-rulengine"></i>Creditease
                    </h3>
                </div>
                <div className={styles['menu']}>
                    {
                        loading ?
                            <Skeleton />
                            :
                            <Menu
                                inlineIndent={12}
                                className={styles['menu-list']}
                                onClick={this.handleClick}
                                selectedKeys={selectedKeys}
                                defaultOpenKeys={openKeys || ''}
                                mode="inline"
                                triggerSubMenuAction="click"
                            >
                                {this.renderMenu(menuConfig)}
                            </Menu>
                    }
                </div>
            </div>
        );
    }
}

export default Comp;
