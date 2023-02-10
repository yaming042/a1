const mysql = require('./mysql');
const {RedisSet, RedisDelete, RedisGet} = require('./redis');
const config = require('./../routes/config');

class User {
    constructor(table) {
        this.table = table;
        this.fields = ['id', 'uid', 'email', 'phone', 'username', 'password', 'company', 'status', 'created_by', 'created_at', 'updated_by', 'updated_at'];
    }

    // 获取用户列表
    getUser() {
        const field = this.fields.filter(i => !['id', 'password'].includes(i)).map(i => `${i}`).join(',');
        const sql ="select "+field+" from `"+this.table+"` order by updated_at desc";
        return new Promise((resolve, reject) => {
            mysql.query(sql, (error, result, fields) => {
                if (error) return resolve(config.responseError.modelError);
                resolve(result);
            });
        });
    }
    // 用户信息
    getUserInfo(id) {
        const field = this.fields.filter(i => !['id', 'password'].includes(i)).map(i => `${i}`).join(',');
        let sql = "select "+field+" from `"+this.table+"` where `uid`=";
        sql += `'${id}'`;
        return new Promise((resolve, reject) => {
            mysql.query(sql, (error, result, fields) => {
                if (error) return resolve(config.responseError.modelError);
                resolve(result);
            });
        });
    }
    // 插入用户
    addUser({uid, email, phone, username, password, company, created_by, c}) {
        const prefixSql = "INSERT INTO `user`(`uid`, `email`, `phone`, `username`, `company`, `password`, `created_by`, `updated_by`) VALUES ";
        const sql = `${prefixSql}('${uid}', '${email}', '${phone}', '${username}', '${company}', '${password}', '${created_by}', '${created_by}')`;
        return new Promise((resolve, reject) => {
            mysql.query(sql, (error, result, fields) => {
                if (error) return resolve(config.responseError.modelError);
                resolve({id: uid});
            });
        });
    }

    // 更新用户
    updateUser(id, {email, phone, username, company, password=''}) {
        let sql = "UPDATE `user` SET `email`='_email', `phone`='_phone', `username`='_username', `company`='_company' WHERE `uid`='_id'";
        if(password) {
            sql = "UPDATE `user` SET `password`='_password' WHERE `uid`='_id'";
        }
        sql = sql.replace(/_email/, email).replace(/_email/, email).replace(/_phone/, phone).replace(/_username/, username).replace(/_company/, company).replace(/_password/, password).replace(/_id/, id);
        return new Promise((resolve, reject) => {
            mysql.query(sql, (error, result, fields) => {
                if (error) return resolve(config.responseError.modelError);
                resolve({id: id});
            });
        });
    }

    // 删除用户
    deleteUser(id) {
        let sql = "DELETE FROM `user` WHERE `uid`='" + id + "'";
        return new Promise((resolve, reject) => {
            mysql.query(sql, (error, result, fields) => {
                if (error) return resolve(config.responseError.modelError);
                resolve({id: id});
            });
        });
    }
}

module.exports = new User('user');