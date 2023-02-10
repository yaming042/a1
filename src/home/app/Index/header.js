import React from 'react';
import styles from './index.scss';

export default class Header extends React.Component{
    constructor(props){
        super(props);

        this.state = {};
    }

    render(){
        return (
            <div className={styles['header']}>
                <div className={styles['logo']}>
                    <a href="#">
                        <img src="/images/icon.png" alt="AnyOne" />
                        AnyOne
                    </a>
                </div>
            </div>
        )
    }
}