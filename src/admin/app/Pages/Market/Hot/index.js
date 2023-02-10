import React from 'react';
import styles from './index.scss';
import {Button, Table, message, Modal} from 'antd';
import dayjs from 'dayjs';
import Loading from '@commonUtils/Loading';
import IconSvg from '@commonUtils/IconSvg';
import HotDetail from './components/HotDetail';
import AddHot from './components/AddHot';
import request from '@commonUtils/request';
import {ObjectUtil} from '@commonUtils/utils';

const {confirm} = Modal;

export default class Hot extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            inRequest: true,
            dataList: [],

            addDialogVisible: false,

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
            request('/hot/list').then(response => {
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
            addDialogVisible: true,
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
    // 删除数据，先弹框再确认删除
    deleteRecord(record, e) {
        e.stopPropagation();
        const {id, name} = record,
            that = this;

        confirm({
            className: '_confirm-dialog',
            title: <div className='_confirm-dialog-title'><IconSvg name="icon-warning" /><span>确定要删除应用 <b>{name || id || ''}</b> 吗？</span></div>,
            icon: null,
            content: <p className='_confirm-dialog-content confirm-warn-msg'>删除此应用后用户即不能再次新建该应用的实例</p>,
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
    // 确认删除组
    confirmDelete(id) {
        return new Promise((resolve, reject) => {
            if(!id) reject();

            request(`/group/delete/${id}`, {method: 'delete'}).then(respond => {
                if(respond && respond.status === 0) {
                    message.success(`删除组成功`);
                    return resolve();
                }
                message.warn(`删除组失败，`, respond && respond.message || '响应异常');
                return reject();
            }).catch(e => {
                message.error(`删除组失败，`, e.message || '网络异常');
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
        const {inRequest, dataList, dialogVisible, addDialogVisible, currentReadOnly, currentData} = this.state;

        return (
            <div className={styles['container']}>
                <Loading loading={inRequest} />
                <div className={styles['header']}>
                    <Button type="primary" onClick={this.createRecord.bind(this)}>新建应用</Button>
                </div>
                <div className={styles['content']}>
                    <div className={styles['list']}>
                        {
                            (dataList || []).map((item, index) => {
                                const firstImage = (item?.logo || '').split(',')[0] || '';

                                return (
                                    <div
                                        key={`${item.id}_${index}`}
                                        className={styles['item']}
                                        onClick={this.viewRecord.bind(this, item)}
                                    >
                                        <div className={styles['thumbnail']}>
                                            <img src={firstImage} alt={item.name} />
                                        </div>
                                        <div className={styles['description']}>{item.description}</div>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>

                {/* 组详情 */}
                <HotDetail
                    visible={dialogVisible}
                    data={currentData}
                    disabled={currentReadOnly}
                    onOk={this.onOk.bind(this)}
                    onCancel={this.onCancel.bind(this)}
                />
                {/* 新增应用 */}
                <AddHot
                    visible={addDialogVisible}
                    onOk={() => {this.setState({addDialogVisible: false})}}
                    onCancel={() => {this.setState({addDialogVisible: false})}}
                />
            </div>
        );
    }
}