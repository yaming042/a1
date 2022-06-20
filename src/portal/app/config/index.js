import loadable from '@loadable/component';

// 路由-组件关系（一维数组，要是渲染菜单就转成tree结构）
const routes = [
    {
        name: '变量管理',
        path: '/variable',
        icon: '',
        auth: true,
        isMenu: true,
        component: null
    },
    {
        name: '规则配置-配置类',
        path: '/variable/variable-config',
        icon: '',
        auth: true,
        isMenu: true,
        component: loadable(() => import(`./../Test`))
    },
];

export const config = routes.map(item => {
    const path = item.path;
    const lastIndex = path.lastIndexOf('/');

    item.id = path;
    item.pid = path.substring(0, lastIndex);

    return item;
});

// 辅助方法，将一维数组转成tree
function convertToTree(data=[]) {
    const list = data.filter(i => i.isMenu === undefined || i.isMenu === true);
    const res = [];
    const map = list.reduce((res, v) => (res[v.id] = v, res), {});
    for (const item of list) {
        if (item.pid === '') {
            res.push(item);
            continue;
        }
        if (item.pid in map) {
            const parent = map[item.pid];
            parent.children = parent.children || [];
            parent.children.push(item);
        }
    }
    return res;
}
// 菜单，树结构
export const menuConfig = convertToTree(config);


export const paginationConfig = {
    pageSize: 20,
    showQuickJumper: true,
    showSizeChanger: true,
    showTotal(total, range) {
        return `第${range[0]}-${range[1]}条 | 共${total} 条`;
    }
};