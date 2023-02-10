import React, {Component} from 'react';
import styles from './index.scss';

export default class Section1 extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div className={styles['section-1']}>你好世界</div>
        );
    }
}