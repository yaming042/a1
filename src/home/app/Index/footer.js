import React, {Component} from 'react';

export default class Footer extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        return (
            <div className="footer">
                <p>阿里巴巴技术有限公司</p>
                <p>京公网安备11000002000001号</p>
                <p>京ICP证030173号</p>
            </div>
        );
    }
}