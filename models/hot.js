const mysql = require('./mysql');
const config = require('../routes/config');

class Hot {
    constructor(table) {
        this.table = table;
        this.fields = ['id', 'icon', 'logo', 'name','description', 'developer', 'created_by', 'created_at', 'updated_by', 'updated_at'];
    }

    // 获取应用列表
    getHot() {
        const field = this.fields.map(i => `${i}`).join(',');
        const sql ="select "+field+" from `"+this.table+"` order by updated_at desc";
        return new Promise((resolve, reject) => {
            mysql.query(sql, (error, result, fields) => {
                if (error) return resolve(config.responseError.modelError);
                resolve(result);
            });
        });
    }
    // 应用信息
    getHotInfo(id) {
        const field = this.fields.map(i => `${i}`).join(',');
        let sql = "select "+field+" from `"+this.table+"` where `id`=";
        sql += `'${id}'`;
        return new Promise((resolve, reject) => {
            mysql.query(sql, (error, result, fields) => {
                if (error) return resolve(config.responseError.modelError);
                resolve(result);
            });
        });
    }
    // 插入应用
    addHot({icon, logo, name, description, developer, created_by, updated_by}) {
        const prefixSql = "INSERT INTO `"+this.table+"`(`icon`, `logo`, `name`, `description`, `developer`, `created_by`, `updated_by`) VALUES ";
        const sql = `${prefixSql}('${icon}', '${logo}', '${name}', '${description}', '${developer}', '${created_by}', '${updated_by}')`;
        return new Promise((resolve, reject) => {
            mysql.query(sql, (error, result, fields) => {
                if (error) return resolve(config.responseError.modelError);
                resolve({id: uid});
            });
        });
    }

    // 删除应用
    deleteHot(id) {
        let sql = "DELETE FROM `"+this.table+"` WHERE `id`='" + id + "'";
        return new Promise((resolve, reject) => {
            mysql.query(sql, (error, result, fields) => {
                if (error) return resolve(config.responseError.modelError);
                resolve({id: id});
            });
        });
    }
}

module.exports = new Hot('client');