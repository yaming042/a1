import React, {Component} from 'react';
import { Upload, message } from 'antd';
import styles from './index.scss';
import IconSvg from '@commonUtils/IconSvg';

class UploadFile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fileList: [],
        };
    }

    beforeUpload(file) {
        const typeMap = {
                'image/png': 'png',
                'image/jpeg': 'jpeg',
            },
            {accept, size} = this.props,
            types = (accept || '').split(',').filter(Boolean);

        if( !types.includes(file.type) ) { // 校验文件类型
            message.error(`请上传${types.map(i => typeMap[i]).join(',')}类型的文件`);
        }else if( file.size/1024/1024 > size ) { // 校验文件大小
            message.error(`请上传不大于${size}M的文件`);
        }

        return false;
    }
    handleChange({file, fileList, e}) {
        console.log(file, fileList, e);
    }

    getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    };

    render() {
        const {limit=1} = this.props,
            {fileList} = this.state,
            uploadButton = <div className={styles['upload-button']}>
                <IconSvg name="icon-add" />上传
            </div>;

        return (
            <>
                <Upload
                    listType="picture-card"
                    fileList={fileList}
                    beforeUpload={this.beforeUpload.bind(this)}
                    multiple={true}
                    onChange={this.handleChange.bind(this)}
                >
                    { fileList.length >= limit ? null : uploadButton }
                </Upload>
            </>
        );
    }
}

export default UploadFile;