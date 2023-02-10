import React, {Component} from 'react';
import Dialog from '@commonUtils/Dialog';
import Permission from '@commonUtils/Permission';
import dialogStyles from '@commonUtils/Dialog/index.scss';
import {Button, Form, Input, Switch, message} from 'antd';
import IconSvg from '@commonUtils/IconSvg';
import Loading from '@commonUtils/Loading';
import dayjs from 'dayjs';
import request from '@commonUtils/request';
import Swiper from './../../../../../components/Swiper';
import _ from 'underscore';
import styles from './index.scss';

class PermissionComponent extends Component{
    constructor(props) {
        super(props);
    }

    getItem(value, buffer=[], type) {
        return (value || []).map(item => {
            const obj = (buffer || []).find(i => i.uid+'' === item+'' || i.id+'' == item+''),
                iconName = `icon-one-${type.substring(0, type.length-1)}`;

            return (
                <div
                    key={`${type}_${item}`}
                    className={styles['permission-item']}
                >
                    <div className={styles['permission-label']}>
                        <div title={obj.username || obj.name || item}>
                            <IconSvg name={iconName} />
                            {obj.username || obj.name || item}
                        </div>
                    </div>
                    <div className={styles['permission-close']} onClick={() => {}}>
                        <IconSvg name="icon-close" />
                    </div>
                </div>
            );
        })
    }

    render() {
        const {onFocus, data={}, value='', placeholder='请点击选择'} = this.props;
        let users=[],
            groups=[],
            roles=[];

        (value || '').split(';').map(item => {
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

        return (
            <div className={styles['permission-container']}>
                <div className={styles['permission-list']}>
                    {this.getItem(users || [], data?.users || [], 'users')}
                    {this.getItem(groups || [], data?.groups || [], 'groups')}
                    {this.getItem(roles || [], data?.roles || [], 'roles')}
                </div>
                <Input placeholder={placeholder} onClick={() => {onFocus(value)}} />
            </div>
        );
    }
}

class InstalledDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            installedInfo: props.data || {},
            inRequest: false,
            step: 1,
            permissionVisible: false,

            data: {users: [], groups: [], roles: []}, // 用户，组，角色数据
            permissionFilter: ['user', 'group', 'role'],
            permissionValue: '',
        };

        this.formRef = React.createRef();
    }

    componentWillReceiveProps(nextProps) {
        if( !_.isEqual(nextProps, this.props) ){
            this.setState({
                installedInfo: nextProps.data || {},
            }, () => {
                const v = this.getFormInitialValue();
                this.formRef?.current?.setFieldsValue(v);
            });
        }
    }

    // 获取表单初始值
    getFormInitialValue() {
        const {installedInfo} = this.state;

        return {
            name: installedInfo.name || undefined,
            description: installedInfo.description || undefined,
            status: Boolean(installedInfo.status) || false,
            permission: installedInfo.permission || '',
        }
    }

    // 立即使用
    toUse() {
        // 获取用户信息
        this.setState({step: 2, inRequest: true});
        // 获取用户列表
        this.getPermissionDataList().then(res => {
            const [users, groups, roles] = res || [];

            this.setState({
                data: {
                    users, groups, roles
                },
                inRequest: false,
            });
        }).catch(e => {
            message.error(`获取信息列表失败`);
        })
    }

    confirm(value) {
        const {permissionFilter} = this.state;

        if(permissionFilter.length === 1) {
            this.formRef.current.setFieldsValue({admin: value});
        }else{
            this.formRef.current.setFieldsValue({permission: value});
        }

        this.setState({permissionVisible: false});
    }

    getPermissionDataList() {
        return Promise.all([
            this.getUserList(),
            this.getGroupList(),
            this.getRoleList()
        ]);
    }
    getUserList() {
        return new Promise((resolve, reject) => {
            request('/user/list').then(response => {
                if(response && 0 === response.status) {
                    return resolve(response.data || {});
                }
                reject(`响应异常`);
            }).catch(e => {
                message.error(e.message);
                reject(`网络异常`);
            });
        });
    }
    getGroupList() {
        return new Promise((resolve, reject) => {
            request('/group/list').then(response => {
                if(response && 0 === response.status) {
                    return resolve(response.data || {});
                }
                reject(`响应异常`);
            }).catch(e => {
                message.error(e.message);
                reject(`网络异常`);
            });
        });
    }
    getRoleList() {
        return new Promise((resolve, reject) => {
            request('/role/list').then(response => {
                if(response && 0 === response.status) {
                    return resolve(response.data || {});
                }
                reject(`响应异常`);
            }).catch(e => {
                message.error(e.message);
                reject(`网络异常`);
            });
        });
    }

    render() {
        const {visible, onCancel} = this.props,
            labelCol = {span: 5},
            wrapperCol = {span: 15},
            {installedInfo, step, data, permissionVisible, permissionFilter, permissionValue, inRequest} = this.state;

        return (
            <>
                <Dialog
                    visible={visible}
                    width={900}
                    height={480}
                >
                    <div className={dialogStyles['dialog-container']}>
                        <Loading loading={inRequest} />
                        <div className={dialogStyles['header']}>
                            <div className={dialogStyles['title']}>应用详情</div>
                            <div className={dialogStyles['close']} onClick={onCancel}>
                                <IconSvg name="icon-close" />
                            </div>
                        </div>
                        <div className={dialogStyles['body']}>
                            <Form
                                name='hot'
                                ref={this.formRef}
                                className={styles['hot-form']}
                                autoComplete="off"
                            >
                                <Form.Item
                                    label="名称"
                                    name="name"
                                    labelCol={labelCol}
                                    wrapperCol={wrapperCol}
                                    rules={[
                                        { required: true, message: '请提供实例名称' },
                                        { max: 255, message: '实例名称过长' }
                                    ]}
                                >
                                    <Input placeholder="请输入实例名称" />
                                </Form.Item>
                                <Form.Item
                                    label="描述"
                                    name="description"
                                    labelCol={labelCol}
                                    wrapperCol={wrapperCol}
                                    rules={[
                                        { max: 255, message: '实例描述过长' }
                                    ]}
                                >
                                    <Input placeholder="请输入实例描述" />
                                </Form.Item>
                                <Form.Item
                                    label="组状态"
                                    name="status"
                                    labelCol={labelCol}
                                    wrapperCol={wrapperCol}
                                    valuePropName="checked"
                                >
                                    <Switch checkedChildren="启用" unCheckedChildren="停用" />
                                </Form.Item>
                                <Form.Item
                                    label="权限分配"
                                    name="permission"
                                    labelCol={labelCol}
                                    wrapperCol={wrapperCol}
                                >
                                    <PermissionComponent
                                        onFocus={(v) => this.setState({permissionVisible: true, permissionFilter: ['user', 'group', 'role'], permissionValue: v || ''})}
                                        data={data}
                                        placeholder="点击为应用分配权限"
                                    />
                                </Form.Item>
                            </Form>
                        </div>
                        <div className={dialogStyles['footer']}>
                            <div className={dialogStyles['button-group']}>
                                {
                                    step === 1 ?
                                        <>
                                            <Button onClick={onCancel}>关闭</Button>
                                            <Button type="primary" onClick={this.toUse.bind(this)}>立即使用</Button>
                                        </>
                                        :
                                        <>
                                            <Button onClick={onCancel}>取消并关闭</Button>
                                            <Button onClick={() => this.setState({step: 1})}>取消</Button>
                                            <Button type="primary" onClick={() => this.setState({step: 2})}>创建</Button>
                                        </>
                                }
                            </div>
                        </div>
                    </div>
                </Dialog>

                {/* 用户、组、角色 */}
                <Permission
                    visible={permissionVisible}
                    filter={permissionFilter}
                    data={data}
                    value={permissionValue}
                    onOk={this.confirm.bind(this)}
                    onCancel={() => this.setState({permissionVisible: false})}
                />
            </>
        );
    }
}

export default InstalledDetail;