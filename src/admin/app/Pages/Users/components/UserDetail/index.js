import React, {Component} from 'react';
import Dialog from '@commonUtils/Dialog';
import dialogStyles from '@commonUtils/Dialog/index.scss';
import {Button} from 'antd';

class UserDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        const {visible} = this.props;

        return (
            <Dialog
                visible={visible}
            >
                <div className={dialogStyles['dialog-container']}>
                    <div className={dialogStyles['header']}>
                        <div className={dialogStyles['title']}>hello world</div>
                        <div className={dialogStyles['close']}></div>
                    </div>
                    <div className={dialogStyles['search']}>
                        <div className="input">搜索</div>
                    </div>
                    <div className={dialogStyles['body']}>

                    </div>
                    <div className={dialogStyles['footer']}>
                        <div className={dialogStyles['button-group']}>
                            <Button type="text" onClick={() => {}}>取消</Button>
                            <Button type="primary" onClick={() => {}}>确定</Button>
                        </div>
                    </div>
                </div>
            </Dialog>
        );
    }
}
export default UserDetail;
