import React from 'react';
import loadable from '@loadable/component';

const baseDir = '/admin';

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
const menuConfig = [
    {
        key: 'users',
        label: '用户管理',
        icon: <i className="iconfont icon-user"></i>,
        component: Users
    },
    {
        key: 'groups',
        label: '组管理',
        icon: <i className="iconfont icon-group"></i>,
        component: Groups
    },
    {
        key: 'roles',
        label: '角色管理',
        icon: <i className="iconfont icon-role"></i>,
        component: Roles
    },
    {
        key: 'market',
        label: '应用市场',
        icon: <i className="iconfont icon-market"></i>,
        children: [
            {
                key: 'installed',
                label: '已部署',
                icon: <i className="iconfont icon-apps-2"></i>,
                component: Installed
            },
            {
                key: 'hot',
                label: '热门应用',
                icon: <i className="iconfont icon-apps-1"></i>,
                component: Hot
            }
        ]
    },
    {
        key: 'system',
        label: '系统管理',
        icon: <i className="iconfont icon-system"></i>,
        component: System
    },
];
// 从菜单配置中得到路由
const routeCofig = menuToRoute(menuConfig);
// 分页配置
const paginationConfig = {
    pageSize: 20,
    showQuickJumper: true,
    showSizeChanger: true,
    showTotal(total, range) {
        return `共${total} 条`;
    }
};
// 网站配置
const webConfig = {
    baseUrl: '/admin'
};

// 导出配置
export default {
    routeCofig,
    menuConfig,
    paginationConfig,
    webConfig
};



// 将menuConfig处理成路由数组
function menuToRoute(tree, pid=baseDir) {
    let res = [];
    for (const item of tree) {
        const {children, ...i} = item;
        const id = `${pid}/${i.key}`;
        if (children && children.length) {
            res = res.concat(menuToRoute(children, id));
        }
        res.push({...i, id, pid});
    }
    return res.filter(i => i.component);
}