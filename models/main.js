const mysql = require('./mysql');
const {RedisSet, RedisDelete, RedisGet} = require('./redis');
const config = require('../routes/config');

class Main {
    constructor(table) {
        this.userTable = 'user';
        this.fields = ['id', 'clientId', 'clientSecret', 'redirectUri', 'logo', 'name', 'created_by', 'created_at', 'updated_by', 'updated_at'];
    }

    // 校验是否登录
    validate() {
        const field = this.fields.filter(i => !['id', 'clientSecret'].includes(i)).map(i => `${i}`).join(',');
        const sql ="select "+field+" from `"+this.table+"` where `status`='1' order by updated_at desc";
        return new Promise((resolve, reject) => {
            mysql.query(sql, (error, result, fields) => {
                if (error) return resolve(config.responseError.modelError);
                resolve(result);
            });
        });
    }
    // 登录
    login(username, password) {
        let sql = "select * from `_table` where `username`='_username' and `password`='_password' and `status`='1'";
        sql = sql.replace(/_table/, this.userTable).replace(/_username/, username).replace(/_password/, password);
        return new Promise((resolve, reject) => {
            mysql.query(sql, (error, result, fields) => {
                if (error) return resolve(config.responseError.modelError);
                resolve(result);
            });
        });
    }
    // 登出
    logout() {

    }
    
}

module.exports = new Main();