import React from 'react';
import {Row, Col, Button, Menu, Dropdown} from 'antd';
import IconSvg from '@commonUtils/IconSvg';
import {connect} from 'react-redux';

// 导入样式
import styles from './index.scss';

class Comp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            drawerOpen: false
        };
    }

    // 处理菜单
    handleDrawer = () => {
        const {drawerOpen} = this.state;
        this.setState({
            drawerOpen: !drawerOpen
        });
    };

    // 处理顶部搜索
    handleSearch = () => {};

    render() {
        const {selectedBizId, bizList} = this.props;
        const {drawerOpen} = this.state;
        const menu = (
            <Menu>
                <Menu.Item key="0">
                    <span>1st menu item</span>
                </Menu.Item>
                <Menu.Item key="1">
                    <span>2nd menu item</span>
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="3">3rd menu item</Menu.Item>
            </Menu>
        );

        return (
            <div className={styles['header']}>
                <Row gutter={10}>
                    <Col span={18} className={`${styles['item']}`}>
                        <div className={styles['search']}>
                            <div className={styles['input']}>
                                <IconSvg name="icon-search" />
                                <input type="text" placeholder="搜索" />
                            </div>
                        </div>
                    </Col>
                    <Col span={6} className={`${styles['item']} ${styles['item-opt']}`}>
                        <div className={styles['account']}>
                            <Dropdown overlay={menu} trigger={['click']}>
                                <Button shape="circle" type="primary">y</Button>
                            </Dropdown>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const {selectedBizId, bizList=[]} = state.main;
    return {
        selectedBizId: selectedBizId,
        bizList: bizList,
    };
}
function mapDispatchToProps(dispatch) {
    return {
        dispatch
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Comp);
