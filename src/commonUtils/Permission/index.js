import React, {Component} from 'react';
import Dialog from '@commonUtils/Dialog';
import dialogStyles from '@commonUtils/Dialog/index.scss';
import {Button, Checkbox, Input, Tabs, message} from 'antd';
import IconSvg from '@commonUtils/IconSvg';
import _ from 'underscore';
import styles from './index.scss';

class Permission extends Component {
    constructor(props) {
        super(props);

        let users=[],
            groups=[],
            roles=[];

        (props.value || '').split(';').map(item => {
            const [type, str] = item.split(':'),
                ids = (str || '').split(',');
            if(type == 'u') {
                users = ids.slice(0);
            }else if(type == 'g') {
                groups = ids.slice(0);
            }else if(type == 'r') {
                roles = ids.slice(0);
            }
        });

        this.state = {
            data: {users: [], groups: [], roles: []},
            activeKey: 'user',
            value: {users, groups, roles},
        };
    }

    componentWillReceiveProps(nextProps) {
        if( !_.isEqual(nextProps, this.props) ) {
            let users=[],
                groups=[],
                roles=[];

            (nextProps.value || '').split(';').map(item => {
                const [type, str] = item.split(':'),
                    ids = (str || '').split(',');
                if(type == 'u') {
                    users = ids.slice(0);
                }else if(type == 'g') {
                    groups = ids.slice(0);
                }else if(type == 'r') {
                    roles = ids.slice(0);
                }
            });

            this.setState({
                data: nextProps.data || {},
                value: {users, groups, roles},
            });
        }
    }

    getTabItems() {
        const {filter} = this.props,
            {data, value} = this.state,
            userData = data?.users || [],
            groupData = data?.groups || [],
            roleData = data?.roles || [];

        let element = [];
        if(filter.includes('user')) {
            element.push(
                <Tabs.TabPane tab="用户" key="user">
                    <div className={styles['tab-item']}>
                        {
                            userData.length ?
                                <Checkbox.Group
                                    options={ (userData || []).map(item => ({label: item.username, value: item.uid})) }
                                    onChange={(v) => {this.setState({value: {...value, users: v}})}}
                                    value={value.users || []}
                                />
                                :
                                <div className={styles['empty']}>暂无数据</div>
                            }
                    </div>
                </Tabs.TabPane>
            );
        }
        if(filter.includes('group')) {
            element.push(
                <Tabs.TabPane tab="组" key="group">
                    <div className={styles['tab-item']}>
                        {
                            groupData.length ?
                                <Checkbox.Group
                                    options={ (groupData || []).map(item => ({label: item.name, value: item.id})) }
                                    onChange={(v) => {this.setState({value: {...value, groups: v}})}}
                                    value={value.groups || []}
                                />
                                :
                                <div className={styles['empty']}>暂无数据</div>
                            }
                    </div>
                </Tabs.TabPane>
            );
        }
        if(filter.includes('role')) {
            element.push(
                <Tabs.TabPane tab="角色" key="role">
                    <div className={styles['tab-item']}>
                        {
                            roleData.length ?
                                <Checkbox.Group
                                    options={ (roleData || []).map(item => ({label: item.name, value: item.id})) }
                                    onChange={(v) => {this.setState({value: {...value, roles: v}})}}
                                    value={value.roles || []}
                                />
                                :
                                <div className={styles['empty']}>暂无数据</div>
                            }
                    </div>
                </Tabs.TabPane>
            );
        }

        return element;
    }

    removeValue(id, type) {
        const {value} = this.state,
            index = value[type].findIndex(i => i+'' === id+''),
            newValue = JSON.parse(JSON.stringify(value));

        newValue[type].splice(index, 1);

        this.setState({value: newValue});
    }

    getItem(value, buffer=[], type) {
        return (value || []).map(item => {
            const obj = (buffer || []).find(i => i.uid === item || i.id == item),
                iconName = `icon-one-${type.substring(0, type.length-1)}`;

            return (
                <div
                    key={`${type}_${obj.uid || obj.id}`}
                    className={styles['item']}
                >
                    <div className={styles['label']}>
                        <div title={obj.username || obj.name || item}>
                            <IconSvg name={iconName} />
                            {obj.username || obj.name || item}
                        </div>
                    </div>
                    <div className={styles['delete']} onClick={this.removeValue.bind(this, item, type)}>
                        <IconSvg name="icon-delete" />
                    </div>
                </div>
            );
        })
    }

    getCount() {
        const {value} = this.state,
            v = (value?.users || []).concat((value?.groups || []), (value?.roles || []));

        return v.length;
    }

    onOk() {
        const {onOk} = this.props,
            {value} = this.state;

        if(onOk && typeof onOk === 'function') {
            let str = '';
            if(value['users'].length) {
                str += `;u:${value['users'].join(',')}`;
            }
            if(value['groups'].length) {
                str += `;g:${value['groups'].join(',')}`;
            }
            if(value['roles'].length) {
                str += `;r:${value['roles'].join(',')}`;
            }

            onOk(str.substring(1));
        }
    }

    render() {
        const {visible, onCancel, filter} = this.props,
            {activeKey, value, data} = this.state,
            userLabel = filter.includes('user') ? `、用户` : '',
            groupLabel = filter.includes('group') ? `、组` : '',
            roleLabel = filter.includes('role') ? `、角色` : '';

        return (
            <Dialog
                visible={visible}
            >
                <div className={dialogStyles['dialog-container']}>
                    <div className={dialogStyles['header']}>
                        <div className={dialogStyles['title']}>分配{`${userLabel}${groupLabel}${roleLabel}`.substring(1)}</div>
                        <div className={dialogStyles['close']} onClick={onCancel}>
                            <IconSvg name="icon-close" />
                        </div>
                    </div>
                    <div className={dialogStyles['body']}>
                        <div className={styles['permission-container']}>
                            <div className={styles['input-container']}>
                                <Tabs
                                    activeKey={activeKey}
                                    onChange={(key) => this.setState({activeKey: key})}
                                >
                                    { this.getTabItems() }
                                </Tabs>
                            </div>
                            <div className={styles['output-container']}>
                                <div className={styles['output-title']}>已选数据 {this.getCount() } 项</div>
                                <div className={styles['output-content']}>
                                    <div className={styles['items']}>
                                        { this.getItem(value?.users, data?.users, 'users') }
                                        { this.getItem(value?.groups, data?.groups, 'groups') }
                                        { this.getItem(value?.roles, data?.roles, 'roles') }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={dialogStyles['footer']}>
                        <div className={dialogStyles['button-group']}>
                            <Button onClick={onCancel}>取消</Button>
                            <Button type="primary" onClick={this.onOk.bind(this)}>确定</Button>
                        </div>
                    </div>
                </div>
            </Dialog>
        );
    }
}

export default Permission;