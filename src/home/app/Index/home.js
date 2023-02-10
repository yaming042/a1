import React from 'react';
import Header from './header';
import Section1 from './section1';
import Section2 from './section2';
import Footer from './footer';

import styles from './index.scss';

export default class Home extends React.Component{
    constructor(props){
        super(props);

        this.state = {};
    }

    render(){
        return (
            <div className={styles['container']}>
                <div className={styles['header-container']}><Header /></div>
                <Section1 />
                <Section2 />
                <Footer />
            </div>
        )
    }
}