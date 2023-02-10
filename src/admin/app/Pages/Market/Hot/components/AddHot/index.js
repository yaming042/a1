import React, {Component} from 'react';
import Dialog from '@commonUtils/Dialog';
import dialogStyles from '@commonUtils/Dialog/index.scss';
import {Button, Form, Input, Switch, message} from 'antd';
import IconSvg from '@commonUtils/IconSvg';
import request from '@commonUtils/request';
import Loading from '@commonUtils/Loading';
import UploadFile from './../../../../../components/UploadFile';
import _ from 'underscore';
import styles from './index.scss';

class HotDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            visible: false,
            inRequest: false,
        };

        this.formRef = React.createRef();
    }

    componentWillReceiveProps(nextProps) {}

    getFormInitialValue() {
        return {};
    }

    render() {
        const {visible, onCancel} = this.props,
            {inRequest} = this.state,
            labelCol = {span: 5},
            wrapperCol = {span: 15},
            initialValues = this.getFormInitialValue();

        return (
            <Dialog
                visible={visible}
            >
                <div className={dialogStyles['dialog-container']}>
                    <Loading loading={inRequest} />
                    <div className={dialogStyles['header']}>
                        <div className={dialogStyles['title']}>新增应用</div>
                        <div className={dialogStyles['close']} onClick={onCancel}>
                            <IconSvg name="icon-close" />
                        </div>
                    </div>
                    <div className={dialogStyles['body']}>
                        <Form
                            name='addHot'
                            ref={this.formRef}
                            className={styles['hot-form']}
                            initialValues={initialValues}
                            autoComplete="off"
                        >
                            <Form.Item
                                label="应用名"
                                name="name"
                                labelCol={labelCol}
                                wrapperCol={wrapperCol}
                                rules={[
                                    { required: true, message: '请提供应用名' },
                                    { max: 128, message: '应用名长度过长' }
                                ]}
                            >
                                <Input placeholder='请填写应用名' />
                            </Form.Item>
                            <Form.Item
                                label="应用描述"
                                name="description"
                                labelCol={labelCol}
                                wrapperCol={wrapperCol}
                                rules={[
                                    { max: 255, message: '应用描述长度过长' }
                                ]}
                            >
                                <Input placeholder='请填写应用描述' />
                            </Form.Item>
                            <Form.Item
                                label="重定向地址"
                                name="redirectUri"
                                labelCol={labelCol}
                                wrapperCol={wrapperCol}
                                rules={[
                                    { max: 128, message: '重定向地址长度过长' }
                                ]}
                            >
                                <Input placeholder='请填写重定向地址' />
                            </Form.Item>
                            <Form.Item
                                label="开发者"
                                name="developer"
                                labelCol={labelCol}
                                wrapperCol={wrapperCol}
                            >
                                <Input placeholder='请填写开发者' />
                            </Form.Item>
                            <Form.Item
                                label="Icon"
                                name="icon"
                                labelCol={labelCol}
                                wrapperCol={wrapperCol}
                            >
                                <UploadFile
                                    accept="icon"
                                    size="1M"
                                />
                            </Form.Item>
                            <Form.Item
                                label="缩略图"
                                name="thumbnail"
                                labelCol={labelCol}
                                wrapperCol={wrapperCol}
                                valuePropName="checked"
                            >
                                <UploadFile
                                    accept="image/png, image/jpeg"
                                    size="1M"
                                />
                            </Form.Item>
                        </Form>
                    </div>
                    <div className={dialogStyles['footer']}>
                        <div className={dialogStyles['button-group']}>
                            {/* 取消就重置数据，关闭只关闭弹框 */}
                            <Button type="text" onClick={() => {}}>关闭</Button>
                            <Button type="primary" onClick={() => {}}>确定</Button>
                        </div>
                    </div>
                </div>
            </Dialog>
        );
    }
}
export default HotDetail;
