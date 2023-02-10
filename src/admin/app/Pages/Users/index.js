import React from 'react';
import styles from './index.scss';
import {Button, Input, Table, message, Modal} from 'antd';
import dayjs from 'dayjs';
import Loading from '@commonUtils/Loading';
import UserDetail from './components/UserDetail';
import IconSvg from '@commonUtils/IconSvg';
import request from '@commonUtils/request';
import SearchComponent from '@commonUtils/Search';
import TableOperation from '@commonUtils/TableOperation';
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

        this.initPageList();
    }

    // 初始化列表
    initPageList() {
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
        const {uid, username} = record,
            that = this;

        confirm({
            className: '_confirm-dialog',
            title: <div className='_confirm-dialog-title'><IconSvg name="icon-warning" /><span>确定要删除用户 <b>{username || uid || ''}</b> 吗？</span></div>,
            icon: null,
            content: <p className='_confirm-dialog-content confirm-warn-msg'>如果不确定是否要从系统中删除该用户，建议先冻结该用户</p>,
            onOk() {
                return new Promise(async (resolve, reject) => {
                    await confirmDelete(uid);
                    that.initPageList();

                    resolve();
                });
            },
            onCancel() {},
        });

        function confirmDelete(id) {
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
    onOk(refresh=false) {
        this.onCancel();

        refresh && this.initPageList();
    }
    // 弹框取消回调
    onCancel() {
        this.setState({
            dialogVisible: false,
            currentReadOnly: false,
            currentData: null,
        });
    }

    render(){
        const {inRequest, userList, dialogVisible, currentReadOnly, currentData} = this.state,
            statusMap = {'0': '冻结', '1': '激活', '2': '未激活', '3': '异常'},
            columns = [
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
                        return statusMap[text.toString()] || '--';
                    }
                },
                {
                    title: '创建时间',
                    dataIndex: 'created_at',
                    ellipsis: true,
                    width: 120,
                    render: (text, record) => {
                        return dayjs(text).format('YYYY-MM-DD HH:mm:ss');
                    }
                },
                {
                    title: '',
                    dataIndex: 'opt',
                    width: 100,
                    render: (text, record) => {
                        return <TableOperation
                            onEdit={{
                                callback: this.editRecord.bind(this, record),
                                disabled: false,
                                disabledTips: ``,
                            }}
                            onDelete={{
                                callback: this.deleteRecord.bind(this, record),
                                disabled: false,
                                disabledTips: ``,
                            }}
                            directMenu={['delete', 'edit']}
                        />;
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