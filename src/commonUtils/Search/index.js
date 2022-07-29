import React, {Component} from 'react';
import {Button, Popover, Checkbox} from 'antd';
import styles from './index.scss';
/*
    fields: [
        {
            key: 'name',
            label: '姓名',
            type: 'string',
            // type: string, number, boolean, time, range<Number>, range<Time>, multiple<String>, multiple<Number>
            component: 'input',
            // component: input, select, radio
            options: [],
            default: null,
        }
    ]
*/

const searchOptions = [
    {
        key: 'username',
        label: '用户名',
        type: 'string',
        component: 'input',
        options: [],
        default: null
    },
    {
        key: 'email',
        label: '邮箱',
        type: 'string',
        component: 'input',
        options: [],
        default: null
    },
    {
        key: 'phone',
        label: '手机号',
        type: 'string',
        component: 'input',
        options: [],
        default: null
    },
    {
        key: 'company',
        label: '公司',
        type: 'string',
        component: 'input',
        options: [],
        default: null
    },
];
const searchValue = {
    username: null,
};
class Comp extends Component {
    constructor(props) {
        super(props);

        this.state = {
            searchOptions: searchOptions,
            searchValue: searchValue,
            searchFields: this.getFieldsFromValue(searchValue, searchOptions),
            moreSearchOptionVisible: false,
        };
    }
    // 处理搜索列表，即展示在页面上的已选筛选项
    getFieldsFromValue(values={}, fields=[]) {
        return fields.filter(i => values.hasOwnProperty(i.key)).map(i => {
            i.value = values[i.key] === null || values[i.key] === undefined ? null : values[i.key];
            return i;
        });
    }
    // 搜索项的操作菜单
    getPopoverContent() {
        return (
            <div>hello world</div>
        );
    }

    // 更多筛选项列表，选一个少一个吧
    getSearchOptions() {
        const {searchOptions} = this.state;

        return (
            <div className={styles['more-search-list']}>
                {
                    searchOptions.map((item, index) => {
                        return (
                            <div key={item.key+index} className={styles['item']}>
                                <Checkbox
                                    onChange={e => {
                                        const checked = e.target.checked;
                                        if(checked) {
                                            
                                        }
                                    }}
                                >{item.label}</Checkbox>
                            </div>
                        );
                    })
                }
            </div>
        );
    }
    // 获取value的展示字样
    getValue(item) {
        const {key, type, options, value=null} = item;
        if(value === null) return '不限';
        // string, number, boolean, time, range<Number>, range<Time>, multiple<String>, multiple<Number>
        switch(type) {

        }
    }

    // popover展示隐藏回调
    popoverSwitch(visible, index) {
        const {searchFields} = this.state;
        searchFields[index]['selected'] = visible;

        this.setState({searchFields});
    }

    render() {
        const {searchFields=[], searchValue={}, moreSearchOptionVisible} = this.state;

        return (
            <div className={styles['container']}>
                <div className={styles['search-list']}>
                    {
                        searchFields.map((item, index) => {
                            const value = this.getValue(item);

                            return (
                                <div key={item.key+index} className={styles['search-item']}>
                                    <Popover
                                        placement="bottom"
                                        title={null}
                                        content={this.getPopoverContent(item)}
                                        trigger="click"
                                        getPopupContainer={e => e.parentNode}
                                        overlayClassName={styles['search-overlay']}
                                        onVisibleChange={visible => this.popoverSwitch(visible, index)}
                                    >
                                        <div className={`${styles['item-box']} ${item.selected ? styles['selected'] : ''}`}>
                                            <div className={styles['label']}>{item.label}：</div>
                                            <div className={styles['input']}>{value}</div>
                                        </div>
                                    </Popover>
                                </div>
                            );
                        })
                    }
                    <div className={styles['more-search-item']}>
                        <Popover
                            placement="bottom"
                            title={null}
                            content={this.getSearchOptions()}
                            trigger="click"
                            getPopupContainer={e => e.parentNode}
                            overlayClassName={styles['more-search-overlay']}
                        >
                            <div className={styles['more-search-item-box']}>
                                <Button size="small" type="primary">更多筛选项</Button>
                            </div>
                        </Popover>
                    </div>
                </div>
            </div>
        );
    }
}
export default Comp;
