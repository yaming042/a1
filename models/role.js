const mysql = require('./mysql');
const config = require('../routes/config');

class Role {
    constructor(table) {
        this.table = table;
        this.userTable = 'role-user';
        this.fields = ['id', 'name', 'description', 'status', 'created_by', 'created_at', 'updated_by', 'updated_at'];
    }

    // 获取组列表
    getRole() {
        const field = this.fields.map(i => `r.${i}`).join(',') + `, count(ru.id) as memberCount`;
        const sql = "select "+field+" from `"+this.table+"` r left join `"+this.userTable+"` ru on r.id=ru.rid group by r.id order by r.updated_at desc";
        return new Promise((resolve, reject) => {
            mysql.query(sql, (error, result, fields) => {
                if (error) return resolve(config.responseError.modelError);
                resolve(result);
            });
        });
    }
    // 组信息
    getRoleInfo(id) {
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
    // 插入组
    addRole({name, description, status, created_by, updated_by}) {
        const prefixSql = "INSERT INTO `"+this.table+"`(`name`, `description`, `status`, `created_by`, `updated_by`) VALUES ";
        const sql = `${prefixSql}('${name}', '${description}', '${status}', '${created_by}', '${updated_by}')`;
        return new Promise((resolve, reject) => {
            mysql.query(sql, (error, result, fields) => {
                if (error) return resolve(config.responseError.modelError);
                resolve({id: uid});
            });
        });
    }

    // 更新组
    updateRole(id, {name, description, status, created_by, updated_by}) {
        let sql = "UPDATE `"+this.table+"` SET `name`='_name', `description`='_description', `status`='_status', `created_by`='_created_by', `updated_by`='_updated_by' WHERE `id`='_id'";
        sql = sql.replace(/_name/, name).replace(/_description/, description).replace(/_status/, status).replace(/_created_by/, created_by).replace(/_updated_by/, updated_by).replace(/_id/, id);
        return new Promise((resolve, reject) => {
            mysql.query(sql, (error, result, fields) => {
                if (error) return resolve(config.responseError.modelError);
                resolve({id: id});
            });
        });
    }

    // 删除组
    deleteRole(id) {
        let sql = "DELETE FROM `"+this.table+"` WHERE `id`='" + id + "'";
        return new Promise((resolve, reject) => {
            mysql.query(sql, (error, result, fields) => {
                if (error) return resolve(config.responseError.modelError);
                resolve({id: id});
            });
        });
    }
}

module.exports = new Role('roles');