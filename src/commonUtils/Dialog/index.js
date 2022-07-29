import React from 'react';
import {Modal} from 'antd';

export default (props) => {
    const SIZE = {
        big: {width: 900, height: 720},
        default: {width: 600, height: 480},
        small: {width: 320, height: 260},
    };

    const {visible=false, onCancel, onOk, width, height, size='default', afterClose, children, className=''} = props;

    return (
        <Modal
            className={className}
            visible={visible}
            title={null}
            closable={false}
            onOk={onOk}
            onCancel={onCancel}
            footer={null}
            width={ width || (size ? (SIZE.hasOwnProperty(size) ? SIZE[size].width : SIZE['default'].width) : SIZE['default'].width) }
            bodyStyle={{height: height || (size ? (SIZE.hasOwnProperty(size) ? SIZE[size].height : SIZE['default'].height) : SIZE['default'].height), padding:0}}
            centered={true}
            afterClose={afterClose || null}
        >
            {children || null}
        </Modal>
    );
};