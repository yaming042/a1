import React, {Component} from 'react';
import styles from './index.scss';

export default class Section2 extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div className={styles['section-2']}>你好世界</div>
        );
    }
}