import React from 'react';
import {Row, Col, Button, Menu, Dropdown} from 'antd';
import IconSvg from '@commonUtils/IconSvg';
import {connect} from 'react-redux';

// 导入样式
import styles from './index.scss';

class Header extends React.Component {
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
            <Menu
                items={[
                    {key: '0', label: <span>1st menu item</span>},
                    {key: '1', label: <span>2st menu item</span>},
                    {key: '2', type: 'divider'},
                    {key: '3', label: <span>3st menu item</span>},
                ]}
            />
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

export default connect(mapStateToProps, mapDispatchToProps)(Header);
