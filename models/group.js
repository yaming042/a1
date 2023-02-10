const mysql = require('./mysql');
const config = require('../routes/config');

class Group {
    constructor(table) {
        this.table = table;
        this.userTable = 'group-user';
        this.fields = ['id', 'name', 'description', 'status', 'created_by', 'created_at', 'updated_by', 'updated_at'];
    }

    // 获取组列表
    getGroup() {
        const field = this.fields.map(i => `g.${i}`).join(',') + `, count(gu.id) as memberCount`;
        const sql = "select "+field+" from `"+this.table+"` g left join `"+this.userTable+"` gu on g.id=gu.gid group by g.id order by g.updated_at desc";
        return new Promise((resolve, reject) => {
            mysql.query(sql, (error, result, fields) => {
                if (error) return resolve(config.responseError.modelError);
                resolve(result);
            });
        });
    }
    // 组信息
    getGroupInfo(id) {
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
    addGroup({name, description, status, created_by, updated_by}) {
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
    updateGroup(id, {name, description, status, created_by, updated_by}) {
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
    deleteGroup(id) {
        let sql = "DELETE FROM `"+this.table+"` WHERE `id`='" + id + "'";
        return new Promise((resolve, reject) => {
            mysql.query(sql, (error, result, fields) => {
                if (error) return resolve(config.responseError.modelError);
                resolve({id: id});
            });
        });
    }
}

module.exports = new Group('groups');