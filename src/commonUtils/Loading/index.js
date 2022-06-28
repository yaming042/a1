import React from 'react';
import {Spin} from 'antd';
import styles from './index.scss';

const Loading = (props) => {
    const {loading, tip='加载中...'} = props;

    return (
        <>
            {
                loading ?
                    <div className={styles['loading']}>
                        <Spin
                            tip={tip}
                        />
                    </div>
                    :
                    null
            }
        </>
    );
};

export default Loading;