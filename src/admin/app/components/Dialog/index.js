import React, {useState, useEffect} from 'react';
import {Modal} from 'antd';

export default (props) => {
    const [width, setWidth] = useState(900);
    const [height, setHeight] = useState(450);

    useEffect(() => {
        const w = document.body.clientWidth,
            h = document.body.clientHeight;

        setWidth(() => parseInt(w*0.8));
        setHeight(() => parseInt(h*0.8));
    });

    return (
        <Modal
            visible={true}
            title={null}
            closable={false}
            onOk={props.onOk}
            onCancel={props.onCancel}
            footer={null}
            width={width}
            bodyStyle={{height: height, padding:0}}
            centered={true}
        >
            {props.children || null}
        </Modal>
    );
};