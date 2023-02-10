import React from 'react';
import {Row, Col, Form, Input, Button, message} from 'antd';
import styles from './index.scss';
import request from '@commonUtils/request';

const FormItemLayout = {
    labelCol: {span: 6},
    wrapperCol: {span: 18},
};

class Login extends React.Component {
    constructor(props) {
        super(props);
    }

    onFinish(values) {
        console.log(`values: `, values);

        request(`/login`, {
            method: 'post',
            contentType: 'application/json',
            data: {
                username: values['username'],
                password: values['password']
            }
        }).then(response => {
            if(response && response.status === 0) {
                message.success(`登录成功`);
                window.location.href = '/';
            }else{
                message.warn(`登录失败`);
            }
        }).catch(error => {
            message.error(`请求异常`);
        });
    }
    onFinishFailed({values, errorFields, outOfDate}) {}

    render() {
        return (
            <div className={styles['container']}>
                <div className={styles['box']}>
                    <h3>欢迎使用AnyOne</h3>
                    <div className={styles['form']}>
                        <Form
                            name="login"
                            onFinish={this.onFinish.bind(this)}
                            onFinishFailed={this.onFinishFailed.bind(this)}
                        >
                            <Form.Item
                                name="username"
                                label="用户名"
                                rules={[
                                    {
                                        required: true,
                                        message: "请填写用户名"
                                    }
                                ]}
                                {...FormItemLayout}
                            >
                                <Input placeholder="请填写用户名" />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                label="密码"
                                rules={[
                                    {
                                        required: true,
                                        message: "请填写密码"
                                    }
                                ]}
                                {...FormItemLayout}
                            >
                                <Input type="password" placeholder="请填写密码" />
                            </Form.Item>
                            <Form.Item
                                wrapperCol={{span: 24}}
                            >
                                <div className={styles['submit']}>
                                    <Button type="primary" htmlType="submit">登录</Button>
                                </div>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;