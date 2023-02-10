import React, {Component} from 'react';
import {Button, Tooltip, Dropdown, Space, Menu} from 'antd'
import PropTypes from 'prop-types';
import IconSvg from '@commonUtils/IconSvg';
import styles from './index.scss';

const menuKey = ['view', 'edit', 'copy', 'delete', 'test', 'export', 'fragment'];
const menuConfig = {
    view: {
        label: '查看',
        danger: false,
        shape: 'circle',
        size: 'small',
        type: '',
        icon: 'icon-view',
        disabled: false,
        disabledTips: '',
        onClick: () => {},
    },
    edit: {
        label: '编辑',
        danger: false,
        shape: 'circle',
        size: 'small',
        type: 'primary',
        icon: 'icon-edit-2',
        disabled: false,
        disabledTips: '',
        onClick: () => {},
    },
    copy: {
        label: '复制',
        danger: false,
        shape: 'circle',
        size: 'small',
        type: '',
        icon: 'icon-copy',
        disabled: false,
        disabledTips: '',
        onClick: () => {},
    },
    delete: {
        label: '删除',
        danger: true,
        shape: 'circle',
        size: 'small',
        type: '',
        icon: 'icon-delete',
        disabled: false,
        disabledTips: '',
        onClick: () => {},
    },
    test: {
        label: '测试',
        danger: false,
        shape: 'circle',
        size: 'small',
        type: '',
        icon: 'icon-json',
        disabled: false,
        disabledTips: '',
        onClick: () => {},
    },
    export: {
        label: '导出',
        danger: false,
        shape: 'circle',
        size: 'small',
        type: '',
        icon: 'icon-download',
        disabled: false,
        disabledTips: '',
        onClick: () => {},
    },
};

class TableOperation extends Component {
    constructor(props) {
        super(props);
    }


    click({key}) {
        menuConfig[key]?.onClick && menuConfig[key]?.onClick();
    }

    getMenuObject() {
        const componentProps = this.props;

        let menuObject = {};
        for(let i=0; i<menuKey.length; i++) {
            const key = menuKey[i],
                onKey = `on${key.charAt().toUpperCase()}${key.substring(1)}`;
            if(componentProps.hasOwnProperty(onKey)) {
                const disabled = componentProps[onKey]?.disabled || menuConfig[key]?.disabled || false;
                menuObject[key] = {
                    ...menuConfig[key],
                    label: componentProps[onKey]?.label || menuConfig[key]?.label || '未定义',
                    type: componentProps[onKey]?.type || menuConfig[key]?.type || 'default',
                    icon: <IconSvg name={componentProps[onKey]?.icon || menuConfig[key]?.icon || 'icon-system'} />,
                    disabled: disabled,
                    disabledTips: disabled ? (componentProps[onKey]?.disabledTips || menuConfig[key]?.disabledTips || '') : '',
                    onClick: componentProps[onKey]?.callback,
                }
            }
        }

        return menuObject;
    }
    /*
        获取直接展示在外面的按钮
    */
    getDirectMenuElement(menuObject) {
        const {directMenu} = this.props;

        return (directMenu || []).map(item => {
            let currentMenuItem = menuObject[item],
                shape = {shape: currentMenuItem?.shape || 'circle'},
                danger = {danger: currentMenuItem?.danger || false},
                type = {type: currentMenuItem?.type || 'default'},
                size = {size: currentMenuItem?.size || 'small'},
                icon = currentMenuItem?.icon || null,
                disabled = {disabled: currentMenuItem?.disabled || false},
                disabledTips = currentMenuItem?.disabled ? (currentMenuItem?.disabledTips || '') : '';

            return (
                <Tooltip key={item} title={disabledTips}>
                    <Button {...type} {...shape} {...size} {...danger} {...disabled} onClick={currentMenuItem?.onClick}>{icon}</Button>
                </Tooltip>
            );
        });
    }
    getMoreMenusElement(menuObject) {
        const {moreMenu, fragment, parentElement} = this.props;

        if(!moreMenu || !moreMenu.length) return null;

        let menusList = moreMenu.map(item => {
            const currentMenuItem = menuObject[item],
                element = <Button key={item} disabled={currentMenuItem?.disabled} className={currentMenuItem?.disabled ? styles['disabled'] : '' }>
                    <Tooltip title={currentMenuItem?.disabled ? currentMenuItem?.disabledTips : ''}>
                        <div className={styles['menu-item']}>
                            {currentMenuItem?.icon}<span>{currentMenuItem?.label}</span>
                        </div>
                    </Tooltip>
                </Button>;

            return item === 'fragment' ? <React.Fragment key={item}><Space/>{fragment}</React.Fragment> : element;
        });

        const menu = (
            <div
                className={ styles['menu'] }
                onClick={e => e.stopPropagation()}
            >
                { menusList }
            </div>
        );

        return (
            <Dropdown
                overlay={ menu }
                trigger={['hover']}
                placement="bottomRight"
                getPopupContainer={e => parentElement || e.parentNode}
            >
                <Button size="small" shape="circle" className={styles['more']} onClick={e => e.stopPropagation()} >
                    <IconSvg name="icon-more-2" />
                </Button>
            </Dropdown>
        );
    }
    render() {
        const menuObject = this.getMenuObject(),
            directMenuElement = this.getDirectMenuElement(menuObject),
            moreMenusElement = this.getMoreMenusElement(menuObject);

        return (
            <div className={styles['table-operation']}>{directMenuElement}{moreMenusElement}</div>
        );
    }
}

TableOperation.propTypes = {
    order: PropTypes.arrayOf([PropTypes.oneOf(menuKey)])
};

export default TableOperation;