import React from 'react';
import styles from './index.scss';
import {Button, Input, Table, message, Modal} from 'antd';
import Loading from '@commonUtils/Loading';
import UserDetail from './components/UserDetail';
import request from '@commonUtils/request';
import SearchComponent from '@commonUtils/Search';
import {ObjectUtil} from '@commonUtils/utils';

const {confirm} = Modal;

export default class Users extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            inRequest: true,
            userList: [],

            dialogVisible: false, // 弹框是否弹出
            currentReadOnly: false, // 是否只读
            currentData: null,
        };
    }

    componentDidMount() {
        message.destroy();
        this.getTableList().then(respond => {
            this.setState({
                inRequest: false,
                userList: respond,
            });
        }).catch(e => {
            message.warn(e.message);
            this.setState({inRequest: false});
        });
    }

    // 获取列表数据
    getTableList() {
        // request返回前需要对数据进行边界和容错处理，因为后续的数据会只直接存储到state中，所以如果不处理就可能出现错误
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

    // 创建数据
    createRecord() {
        this.setState({
            dialogVisible: true,
            currentReadOnly: false,
            currentData: {}
        });
    }
    // 预览数据
    viewRecord(record, e) {
        this.setState({
            dialogVisible: true,
            currentReadOnly: true,
            currentData: ObjectUtil.deepClone(record || {})
        });
    }
    // 编辑数据
    editRecord(record, e) {
        e.stopPropagation();

        this.setState({
            dialogVisible: true,
            currentReadOnly: false,
            currentData: ObjectUtil.deepClone(record || {})
        });
    }
    // 删除数据
    deleteRecord(record, e) {
        e.stopPropagation();
        const {uid, username} = record;

        confirm({
            className: '_confirm-dialog',
            title: <span>确定要删除用户 <b>{username || uid || ''}</b> 吗？</span>,
            icon: <i className="iconfont icon-warning"></i>,
            content: <p className='confirm-msg confirm-warn-msg'>如果不确定是否要从系统中删除该用户，建议先冻结该用户</p>,
            onOk() {
                return confirmDelete();
            },
            onCancel() {},
        });

        function confirmDelete(id) {
            message.destroy();
            return new Promise((resolve, reject) => {
                if(!id) reject();
                request(`/user/delete/${id}`, {method: 'delete'}).then(respond => {
                    if(respond && respond.status === 0) {
                        message.success(`删除用户成功`);
                        return resolve();
                    }
                    message.warn(`删除用户失败，`, respond && respond.message || '响应异常');
                    return reject();
                }).catch(e => {
                    message.error(`删除用户失败，`, e.message || '网络异常');
                    reject(e.message);
                });
            });
        }
    }

    // 弹框确定回调
    onOk() {}
    // 弹框取消回调
    onCancel() {
        this.setState({
            dialogVisible: false,
            currentReadOnly: false,
            currentData: null,
        });
    }

    render(){
        const {inRequest, userList, dialogVisible, currentReadOnly, currentData} = this.state;
        const columns = [
            {
                title: 'ID',
                dataIndex: 'uid',
                ellipsis: true,
                width: 50,
                render: (text, record) => {
                    return text;
                }
            },
            {
                title: '用户名',
                dataIndex: 'username',
                ellipsis: true,
                width: 100,
                render: (text, record) => {
                    return text;
                }
            },
            {
                title: '邮箱',
                dataIndex: 'email',
                ellipsis: true,
                width: 100,
                render: (text, record) => {
                    return text;
                }
            },
            {
                title: '手机号',
                dataIndex: 'phone',
                ellipsis: true,
                width: 100,
                render: (text, record) => {
                    return text;
                }
            },
            {
                title: '公司',
                dataIndex: 'company',
                ellipsis: true,
                width: 150,
                render: (text, record) => {
                    return text;
                }
            },
            {
                title: '状态',
                dataIndex: 'status',
                ellipsis: true,
                width: 80,
                render: (text, record) => {
                    return text;
                }
            },
            {
                title: '创建时间',
                dataIndex: 'created_at',
                ellipsis: true,
                width: 120,
                render: (text, record) => {
                    return text;
                }
            },
            {
                title: '',
                dataIndex: 'opt',
                width: 100,
                render: (text, record) => {
                    return <div className={styles['table-opt-td']} onClick={this.deleteRecord.bind(this, record)}>
                        <Button shape="circle" danger size="small">
                            <i className="iconfont icon-delete"></i>
                        </Button>
                        <Button type="primary" shape="circle" size="small" onClick={this.editRecord.bind(this, record)}>
                            <i className="iconfont icon-edit-2"></i>
                        </Button>
                    </div>;
                }
            },
        ];

        return (
            <div className={styles['container']}>
                <Loading loading={inRequest} />
                <div className={styles['header']}>
                    <Button type="primary" onClick={this.createRecord.bind(this)}>新增用户</Button>
                </div>
                <div className={styles['search']}>
                    <SearchComponent />
                </div>
                <div className={styles['content']}>
                    <Table
                        size="small"
                        columns={columns}
                        dataSource={userList}
                        rowKey={r => r.uid}
                        onRow={record => {
                            return {
                                onClick: (e) => {this.viewRecord(record, e);}
                            };
                        }}
                    />
                </div>

                {/* 用户详情 */}
                <UserDetail
                    visible={dialogVisible}
                    data={currentData}
                    disabled={currentReadOnly}
                    onOk={this.onOk.bind(this)}
                    onCancel={this.onCancel.bind(this)}
                />
            </div>
        );
    }
}