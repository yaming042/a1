const mysql = require('./mysql');
const {RedisSet, RedisDelete, RedisGet} = require('./redis');
const config = require('./../routes/config');

class Client {
    constructor(table) {
        this.table = table;
        this.fields = ['id', 'clientId', 'clientSecret', 'redirectUri', 'logo', 'name', 'created_by', 'created_at', 'updated_by', 'updated_at']
    }

    // 获取client列表
    getClient() {
        const field = this.fields.filter(i => !['id', 'clientSecret'].includes(i)).map(i => `${i}`).join(',');
        const sql ="select "+field+" from `"+this.table+"` order by updated_at desc";
        return new Promise((resolve, reject) => {
            mysql.query(sql, (error, result, fields) => {
                if (error) return resolve(config.responseError.modelError);
                resolve(result);
            });
        });
    }
    // 获取client的秘钥
    getClientSecret(id) {
        const sql ="select `clientSecret` from `"+this.table+"` where `clientId`='"+id+"'";
        return new Promise((resolve, reject) => {
            mysql.query(sql, (error, result, fields) => {
                if (error) return resolve(config.responseError.modelError);
                resolve(result);
            });
        });
    }
    // client信息
    getClientInfo(id) {
        const field = this.fields.filter(i => !['id', 'clientSecret'].includes(i)).map(i => `${i}`).join(',');
        let sql = "select "+field+" from `"+this.table+"` where `uid`=";
        sql += `'${id}'`;
        return new Promise((resolve, reject) => {
            mysql.query(sql, (error, result, fields) => {
                if (error) return resolve(config.responseError.modelError);
                resolve(result);
            });
        });
    }
    // 插入client
    addClient({uid, email, phone, username, password, company}) {
        const prefixSql = "INSERT INTO `user`(`uid`, `email`, `phone`, `username`, `company`, `password`) VALUES ";
        const sql = `${prefixSql}('${uid}', '${email}', '${phone}', '${username}', '${company}', '${password}')`;
        return new Promise((resolve, reject) => {
            mysql.query(sql, (error, result, fields) => {
                if (error) return resolve(config.responseError.modelError);
                resolve({id: uid});
            });
        });
    }

    // 更新client
    updateClient(id, {email, phone, username, company, password=''}) {
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

    // 删除client
    deleteClient(id) {
        let sql = "DELETE FROM `user` WHERE `uid`=" + id;
        return new Promise((resolve, reject) => {
            mysql.query(sql, (error, result, fields) => {
                if (error) return resolve(errorJson);
                resolve({id: id});
            });
        });
    }
}

module.exports = new Client('client');