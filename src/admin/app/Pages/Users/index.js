import React from 'react';
import styles from './index.scss';
import {Button, Input, Table, message} from 'antd';
import request from '@commonUtils/request';
import Loading from '@commonUtils/Loading';

export default class Users extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            inRequest: true,
            userList: [],
        };
    }

    componentDidMount() {
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

    getTableList() {
        // request返回前需要对数据进行边界和容错处理，因为后续的数据会只直接存储到state中，所以如果不处理就可能出现错误
        return new Promise((resolve, reject) => {
            request('/user/list').then(response => {
                if(response && 0 === response.status) {
                    return resolve(response.data || {});
                }
                reject(`响应异常`);
            }).catch(e => {
                message.error(e.essage);
                reject(`响应异常`);
            });
        });
    }

    render(){
        const {inRequest, userList} = this.state;
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
                    return <div className={styles['table-opt-td']}>
                        <Button shape="circle" danger size="small">
                            <i className="iconfont icon-delete"></i>
                        </Button>
                        <Button type="primary" shape="circle" size="small">
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
                    <Button type="primary">新增用户</Button>
                </div>
                <div className={styles['search']}>
                    
                </div>
                <div className={styles['content']}>
                    <Table
                        size="small"
                        columns={columns}
                        dataSource={userList}
                        rowKey={r => r.uid}
                    />
                </div>
            </div>
        );
    }
}