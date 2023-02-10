import React from 'react';
import loadable from '@loadable/component';
import IconSvg from '@commonUtils/IconSvg';
import {ObjectUtil} from '@commonUtils/utils';


// First：网站配置
const webConfig = {
    baseUrl: '/admin'
};


// {key: 页面路由， id: 页面标识}
// 将config处理成路由数组
function configToRoute(tree, pid = webConfig.baseUrl) {
    let res = [];
    for (const item of tree) {
        const {children, ...i} = item;
        const key = `${pid}/${i.key}`,
            id = i.key;
        if (children && children.length) {
            res = res.concat(configToRoute(children, key));
        }
        res.push({...i, key, id});
    }
    return res.filter(i => i.component);
}
// 将config处理成菜单，供sider使用
function configToMenu(tree, pid = webConfig.baseUrl) {
    let ret = [];
    for (const item of tree) {
        const pathKey = `${pid}/${item.key}`;

        if (item.children && item.children.length) {
            item.children = configToMenu(item.children, pathKey);
        }

        ret.push({...item, key: pathKey});
    }
    return ret;
}

// 导入组件
const Users = loadable(() => import('./Pages/Users'));
const Groups = loadable(() => import('./Pages/Groups'));
const Roles = loadable(() => import('./Pages/Roles'));
const Installed = loadable(() => import('./Pages/Market/Installed'));
const Hot = loadable(() => import('./Pages/Market/Hot'));
const System = loadable(() => import('./Pages/System'));

/*
    key是菜单的关键字段，path是路由的关键字段，所以这里用key标识路由
*/
// 菜单
const config = [
    {
        key: 'users',
        label: '用户管理',
        icon: <i><IconSvg name="icon-user" /></i>,
        component: Users
    },
    {
        key: 'groups',
        label: '组管理',
        icon: <i><IconSvg name="icon-group" /></i>,
        component: Groups
    },
    {
        key: 'roles',
        label: '角色管理',
        icon: <i><IconSvg name="icon-roles" /></i>,
        component: Roles
    },
    {
        key: 'market',
        label: '应用市场',
        icon: <i><IconSvg name="icon-market-1" /></i>,
        children: [
            {
                key: 'installed',
                label: '已部署',
                icon: <i><IconSvg name="icon-apps-2" /></i>,
                component: Installed
            },
            {
                key: 'hot',
                label: '热门应用',
                icon: <i><IconSvg name="icon-apps-1" /></i>,
                component: Hot
            }
        ]
    },
    {
        key: 'system',
        label: '系统管理',
        icon: <i><IconSvg name="icon-system" /></i>,
        component: System
    },
];

// 从菜单配置中得到路由
const routeConfig = configToRoute(config);

const menuConfig = configToMenu(config);
// 分页配置
const paginationConfig = {
    pageSize: 20,
    showQuickJumper: true,
    showSizeChanger: true,
    showTotal(total, range) {
        return `共${total} 条`;
    }
};

// 导出配置
export default {
    routeConfig,
    menuConfig,
    paginationConfig,
    webConfig
};