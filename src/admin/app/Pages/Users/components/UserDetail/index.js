import React, {Component} from 'react';
import Dialog from '@commonUtils/Dialog';
import dialogStyles from '@commonUtils/Dialog/index.scss';
import {Button, Form, Input, Checkbox, message} from 'antd';
import IconSvg from '@commonUtils/IconSvg';
import request from '@commonUtils/request';
import Loading from '@commonUtils/Loading';
import {StringUtil} from '@commonUtils/utils';
import _ from 'underscore';
import styles from './index.scss';

class UserDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userInfo: props.data || {},
            visible: false,
            inRequest: false,
        };

        this.formRef = React.createRef();
    }

    componentWillReceiveProps(nextProps) {
        if( !_.isEqual(nextProps, this.props) ){
            this.setState({
                userInfo: nextProps.data || {},
            }, () => {
                const v = this.getFormInitialValue();
                this.formRef?.current?.setFieldsValue(v);
            });
        }
    }

    // 获取表单初始值
    getFormInitialValue() {
        const {userInfo} = this.state;

        return {
            username: userInfo.username || undefined,
            email: userInfo.email || undefined,
            phone: userInfo.phone || undefined,
            company: userInfo.company || undefined,
            sendMail: false,
            status: userInfo.status || 3,
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
        let {onOk} = this.props,
            {userInfo} = this.state,
            isNew = !userInfo?.uid,
            url = isNew ? '/user/add' : '/user/update',
            method = isNew ? 'POST' : 'PUT',
            postData = {url, method}

        this.formRef.current.validateFields().then(values => {
            this.setState({inRequest: true});

            postData['data'] = {...values};
            if(!isNew) {
                postData['data']['id'] = userInfo.uid;
            }
            this.postUserInfo(postData).then(respond => {
                message.success(`${isNew ? '新建' : '更新'}用户成功`);
                onOk && onOk(true);
            }).catch(e => {
            }).finally(() => {
                this.setState({inRequest: false});
            });
        }).catch(e => {});
    }

    postUserInfo(options) {
        return new Promise((resolve, reject) => {
            request(options.url, {
                method: options.method,
                data: options.data,
            }).then(response => {
                if(0 === response?.status) {
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
            {userInfo, inRequest} = this.state,
            labelCol = {span: 5},
            wrapperCol = {span: 15},
            statusMap = {'0': '冻结', '1': '激活', '2': '未激活', '3': '异常'},
            userName = userInfo?.username || '',
            isNew = !userInfo.uid,
            unActive = userInfo.status+'' === '2',
            initialValues = this.getFormInitialValue();

        return (
            <Dialog
                visible={visible}
                height="auto"
            >
                <div className={dialogStyles['dialog-container']}>
                    <Loading loading={inRequest} />
                    <div className={dialogStyles['header']}>
                        <div className={dialogStyles['title']}>{userName ? (disabled ? '查看' : '编辑') : `新建`}用户{userName ? ` - ${userName}` : ''}</div>
                        <div className={dialogStyles['close']} onClick={onCancel}>
                            <IconSvg name="icon-close" />
                        </div>
                    </div>
                    <div className={dialogStyles['body']}>
                        <Form
                            name='user'
                            ref={this.formRef}
                            className={styles['user-form']}
                            initialValues={initialValues}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="用户名"
                                name="username"
                                labelCol={labelCol}
                                wrapperCol={wrapperCol}
                                rules={[
                                    { required: true, message: '请提供用户名' },
                                    { max: 128, message: '用户名长度过长' }
                                ]}
                            >
                                <Input placeholder='请填写用户名' />
                            </Form.Item>
                            <Form.Item
                                label="邮箱"
                                name="email"
                                labelCol={labelCol}
                                wrapperCol={wrapperCol}
                                rules={[
                                    { required: true, message: '请提供用户邮箱' },
                                    { validator: (_, value) => {
                                        if (value && !StringUtil.isEmail(value)) {
                                            return Promise.reject(new Error('请填写正确格式的邮箱地址'));
                                        }
                                        return Promise.resolve();
                                    } }
                                ]}
                            >
                                <Input placeholder='请填写用户邮箱' />
                            </Form.Item>
                            <Form.Item
                                label="手机号"
                                name="phone"
                                labelCol={labelCol}
                                wrapperCol={wrapperCol}
                                rules={[
                                    { required: true, message: '请提供用户手机号' },
                                    { validator: (_, value) => {
                                        if (value && !StringUtil.isMobile(value)) {
                                            return Promise.reject(new Error('请填写正确格式的手机号'));
                                        }
                                        return Promise.resolve();
                                    } }
                                ]}
                            >
                                <Input placeholder='请填写用户手机号' />
                            </Form.Item>
                            <Form.Item
                                label="公司"
                                name="company"
                                labelCol={labelCol}
                                wrapperCol={wrapperCol}
                                rules={[
                                    { max: 1024, message: '公司名长度过长' }
                                ]}
                            >
                                <Input placeholder='请填写用户公司' />
                            </Form.Item>
                            {
                                unActive || isNew ?
                                    <Form.Item
                                        label="是否发送验证邮件"
                                        name="sendMail"
                                        valuePropName="checked"
                                        labelCol={labelCol}
                                        wrapperCol={wrapperCol}
                                    >
                                        <Checkbox>发送验证邮件</Checkbox>
                                    </Form.Item>
                                    :
                                    <Form.Item
                                        label="用户状态"
                                        name="status"
                                        labelCol={labelCol}
                                        wrapperCol={wrapperCol}
                                    >
                                        {statusMap[initialValues.status.toString()] || '--'}
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
export default UserDetail;
