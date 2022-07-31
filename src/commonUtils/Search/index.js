import React, {Component} from 'react';
import {Button, Popover, Checkbox, Select, Input, InputNumber, Radio, DatePicker} from 'antd';
import moment from 'moment';
import styles from './index.scss';

const {RangePicker} = DatePicker;
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
    // 获取更多筛选项字段
    getMoreSearchFields(values={}, fields=[]) {
        return fields.filter(i => !values.hasOwnProperty(i.key));
    }
    /*
        搜索项的操作菜单
        1. string -> 输入框、单选下拉框
        2. number -> 数字输入框、单选下拉框
        3. boolean -> 单选框
        4. time -> 时间选择器
        5. range<Number> -> 两个数字输入框
        5. range<Time> -> 两个时间选择器
        5. multiple<String> -> 多选下拉框
        5. multiple<Number> -> 多选下拉框

        component: input, select, radio
        type: string, number, boolean, time, range<Number>, range<Time>, multiple<String>, multiple<Number>
    */
    getPopoverContent(item={}) {
        const {key, label, type, component, options=[], value=null} = item;
        let element = null;

        if('string' === type) {
            if('select' === component) {
                element = (
                    <Select
                        placeholder={`请选择${label}`}
                        allowClear
                        options={options}
                        value={value}
                    />
                );
            }else{
                element = <Input placeholder={`请输入${label}`} value={value} allowClear />;
            }
        }else if('number' === type) {
            if('select' === component) {
                element = (
                    <Select
                        placeholder={`请选择${label}`}
                        allowClear
                        options={options}
                        value={value}
                    />
                );
            }else{
                element = <InputNumber placeholder={`请输入${label}`} value={value} />;
            }
        }else if('boolean' === type) { // 没有input这个类型
            if('select' === component) {
                element = (
                    <Select
                        placeholder={`请选择${label}`}
                        allowClear
                        options={options}
                        value={value}
                    />
                );
            }else{
                element = <Radio.Group options={options} value={value} />;
            }
        }else if('time' === type) {
            element = <DatePicker showTime />;
        }else if('range<Number>' === type) {
            element = (
                <div className='range-number'>
                    <InputNumber placeholder={`请输入${label}`} value={value} />
                    -
                    <InputNumber placeholder={`请输入${label}`} value={value} />;
                </div>
            );
        }else if('range<Time>' === type) {
            element = (
                <RangePicker
                    disabledDate={null}
                    disabledTime={null}
                    showTime={{
                        hideDisabledOptions: true,
                        defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('11:59:59', 'HH:mm:ss')],
                    }}
                    format="YYYY-MM-DD HH:mm:ss"
                />
            );
        }else if('multiple<String>' === type) {
            element = (
                <Select
                    placeholder={`请选择${label}`}
                    mode="multiple"
                    allowClear
                    options={options}
                    value={value}
                />
            );
        }else if('multiple<Number>' === type) {
            element = (
                <Select
                    placeholder={`请选择${label}`}
                    mode="multiple"
                    allowClear
                    options={options}
                    value={value}
                />
            );
        }

        return element;
    }

    // 更多筛选项列表，选一个少一个吧
    getSearchOptions(searchOptions=[]) {

        return (
            <div className={styles['more-search-list']}>
                {
                    !searchOptions.length ?
                        '空空如也~'
                        :
                        null
                }
                {
                    searchOptions.map((item, index) => {
                        return (
                            <div key={item.key+index} className={styles['item']}>
                                <Checkbox
                                    onChange={e => {
                                        if(e.target.checked) {
                                            const {searchValue} = this.state;
                                            this.setState({searchValue: {...searchValue, [item.key]: null}});
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
        let text = '';
        switch(type) {
                case 'string':
                    text = 'string';
                    break;
                case 'number':
                    text = 'number';
                    break;
                case 'boolean':
                    text = 'boolean';
                    break;
                case 'time':
                    text = 'time';
                    break;
                case 'range<Number>':
                    text = 'range<Number>';
                    break;
                case 'range<Time>':
                    text = 'range<Time>';
                    break;
                case 'multiple<String>':
                    text = 'multiple<String>';
                    break;
                case 'multiple<Number>':
                    text = 'multiple<Number>';
                    break;
                default:
                    text = '';
        }

        return text;
    }

    // popover展示隐藏回调
    popoverSwitch(visible, index) {
        const {searchFields} = this.state;
        searchFields[index]['selected'] = visible;

        this.setState({searchFields});
    }

    render() {
        const {searchOptions=[], searchValue={}, moreSearchOptionVisible} = this.state;

        // 获取已勾选的筛选项
        const searchFields = this.getFieldsFromValue(searchValue, searchOptions);
        // 获取更多筛选项可用字段
        const moreSearchOptions = this.getMoreSearchFields(searchValue, searchOptions);

        console.log(1, searchValue, searchOptions, moreSearchOptions);

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
                            placement="bottomLeft"
                            title={null}
                            content={this.getSearchOptions(moreSearchOptions)}
                            trigger="click"
                            getPopupContainer={e => e.parentNode}
                            overlayClassName={styles['more-search-overlay']}
                        >
                            <div className={styles['more-search-item-box']}>
                                <Button size="small" type="primary" disabled={!moreSearchOptions.length}>更多筛选项</Button>
                            </div>
                        </Popover>
                    </div>
                </div>
            </div>
        );
    }
}
export default Comp;
