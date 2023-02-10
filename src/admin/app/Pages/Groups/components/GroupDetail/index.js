import React, {Component} from 'react';
import Dialog from '@commonUtils/Dialog';
import dialogStyles from '@commonUtils/Dialog/index.scss';
import {Button, Form, Input, Switch, message} from 'antd';
import IconSvg from '@commonUtils/IconSvg';
import request from '@commonUtils/request';
import Loading from '@commonUtils/Loading';
import {StringUtil} from '@commonUtils/utils';
import _ from 'underscore';
import styles from './index.scss';

class GroupDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            groupInfo: props.data || {},
            visible: false,
            inRequest: false,
        };

        this.formRef = React.createRef();
    }

    componentWillReceiveProps(nextProps) {
        if( !_.isEqual(nextProps, this.props) ){
            this.setState({
                groupInfo: nextProps.data || {},
            }, () => {
                const v = this.getFormInitialValue();
                this.formRef?.current?.setFieldsValue(v);
            });
        }
    }

    // 获取表单初始值
    getFormInitialValue() {
        const {groupInfo} = this.state;

        return {
            name: groupInfo.name || undefined,
            description: groupInfo.description || undefined,
            status: Boolean(groupInfo.status) || false,
            memberCount: groupInfo.memberCount || 0,
        }
    }
    // 取消编辑
    onCancel() {
        const {onCancel} = this.props;
        onCancel && onCancel();
        this.formRef.current.resetFields();
    }
    // 保存
    onSubmit() {
        const {onOk} = this.props,
            {groupInfo} = this.state,
            isNew = !groupInfo?.id;

        this.formRef.current.validateFields().then(values => {
            this.setState({inRequest: true});

            this.postGroupInfo(values).then(respond => {
                message.success(`${isNew ? '新建' : '更新'}组成功`);
                onOk && onOk(true);
            }).catch(e => {
            }).finally(() => {
                this.setState({inRequest: false});
            });
        }).catch(e => {});
    }

    postGroupInfo(postData) {
        return new Promise((resolve, reject) => {
            request('/group/add', {
                method: 'POST',
                data: postData,
            }).then(response => {
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
        const {visible, disabled, onCancel} = this.props,
            {groupInfo, inRequest} = this.state,
            labelCol = {span: 5},
            wrapperCol = {span: 15},
            statusMap = {'0': '冻结', '1': '激活'},
            groupName = groupInfo?.name || '',
            isNew = !groupInfo.id,
            initialValues = this.getFormInitialValue();

        return (
            <Dialog
                visible={visible}
                height="auto"
            >
                <div className={dialogStyles['dialog-container']}>
                    <Loading loading={inRequest} />
                    <div className={dialogStyles['header']}>
                        <div className={dialogStyles['title']}>{groupName ? (disabled ? '查看' : '编辑') : `新建`}组{groupName ? ` - ${groupName}` : ''}</div>
                        <div className={dialogStyles['close']} onClick={onCancel}>
                            <IconSvg name="icon-close" />
                        </div>
                    </div>
                    <div className={dialogStyles['body']}>
                        <Form
                            name='group'
                            ref={this.formRef}
                            className={styles['group-form']}
                            initialValues={initialValues}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="组名"
                                name="name"
                                labelCol={labelCol}
                                wrapperCol={wrapperCol}
                                rules={[
                                    { required: true, message: '请提供组名' },
                                    { max: 128, message: '组名长度过长' }
                                ]}
                            >
                                <Input placeholder='请填写组名' />
                            </Form.Item>
                            <Form.Item
                                label="组描述"
                                name="description"
                                labelCol={labelCol}
                                wrapperCol={wrapperCol}
                                rules={[
                                    { max: 128, message: '组描述长度过长' }
                                ]}
                            >
                                <Input placeholder='请填写组描述' />
                            </Form.Item>
                            <Form.Item
                                label="成员"
                                name="member"
                                labelCol={labelCol}
                                wrapperCol={wrapperCol}
                            >
                                <Input placeholder='请选择组成员' />
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
                            {
                                isNew ?
                                    null
                                    :
                                    <Form.Item
                                        label="组成员数"
                                        name="memberCount"
                                        labelCol={labelCol}
                                        wrapperCol={wrapperCol}
                                    >
                                        {initialValues.memberCount || 0}
                                    </Form.Item>
                            }
                        </Form>
                    </div>
                    <div className={dialogStyles['footer']}>
                        <div className={dialogStyles['button-group']}>
                            {/* 取消就重置数据，关闭只关闭弹框 */}
                            <Button type="text" onClick={this.onCancel.bind(this)}>取消</Button>
                            <Button type="primary" onClick={this.onSubmit.bind(this)}>确定</Button>
                        </div>
                    </div>
                </div>
            </Dialog>
        );
    }
}
export default GroupDetail;
