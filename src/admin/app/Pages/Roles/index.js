import React from 'react';
import styles from './index.scss';
import {Button, Table, message, Modal} from 'antd';
import dayjs from 'dayjs';
import Loading from '@commonUtils/Loading';
import IconSvg from '@commonUtils/IconSvg';
import RoleDetail from './components/RoleDetail';
import request from '@commonUtils/request';
import {ObjectUtil} from '@commonUtils/utils';

const {confirm} = Modal;

export default class Roles extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            inRequest: true,
            dataList: [],

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
                dataList: respond,
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
    // 删除数据，先弹框再确认删除
    deleteRecord(record, e) {
        e.stopPropagation();
        const {id, name} = record,
            that = this;

        confirm({
            className: '_confirm-dialog',
            title: <div className='_confirm-dialog-title'><IconSvg name="icon-warning" /><span>确定要删除角色 <b>{name || id || ''}</b> 吗？</span></div>,
            icon: null,
            content: <p className='_confirm-dialog-content confirm-warn-msg'>如果不确定是否要从系统中删除该角色，建议先冻结该角色</p>,
            onOk() {
                return new Promise(async (resolve, reject) => {
                    await this.confirmDelete(id);
                    that.initPageList();

                    resolve();
                });
            },
            onCancel() {},
        });
    }
    // 确认删除角色
    confirmDelete(id) {
        return new Promise((resolve, reject) => {
            if(!id) reject();

            request(`/role/delete/${id}`, {method: 'delete'}).then(respond => {
                if(respond && respond.status === 0) {
                    message.success(`删除角色成功`);
                    return resolve();
                }
                message.warn(`删除角色失败，`, respond && respond.message || '响应异常');
                return reject();
            }).catch(e => {
                message.error(`删除角色失败，`, e.message || '网络异常');
                reject(e.message);
            });
        });
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
        const {inRequest, dataList, dialogVisible, currentReadOnly, currentData} = this.state,
            statusMap = {'0': '禁用', '1': '启用'},
            columns = [
                {
                    title: '角色名',
                    dataIndex: 'name',
                    ellipsis: true,
                    width: 100,
                    render: (text, record) => {
                        return text;
                    }
                },
                {
                    title: '描述',
                    dataIndex: 'description',
                    ellipsis: true,
                    width: 100,
                    render: (text, record) => {
                        return text;
                    }
                },
                {
                    title: '成员数',
                    dataIndex: 'memberCount',
                    ellipsis: true,
                    width: 100,
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
                    title: '更新时间',
                    dataIndex: 'updated_at',
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
                        return <div className={styles['table-opt-td']} onClick={this.deleteRecord.bind(this, record)}>
                            <Button shape="circle" danger size="small">
                                <IconSvg name="icon-delete" />
                            </Button>
                            <Button type="primary" shape="circle" size="small" onClick={this.editRecord.bind(this, record)}>
                                <IconSvg name="icon-edit-2" />
                            </Button>
                        </div>;
                    }
                },
            ];

        return (
            <div className={styles['container']}>
                <Loading loading={inRequest} />
                <div className={styles['header']}>
                    <Button type="primary" onClick={this.createRecord.bind(this)}>新建角色</Button>
                </div>
                <div className={styles['content']}>
                    <Table
                        size="small"
                        columns={columns}
                        dataSource={dataList}
                        rowKey={r => r.id}
                        onRow={record => {
                            return {
                                onClick: (e) => {this.viewRecord(record, e);}
                            };
                        }}
                    />
                </div>

                {/* 角色详情 */}
                <RoleDetail
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