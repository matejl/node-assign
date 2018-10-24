
const mainDb = require('../database/main');
const CustomError = require('../app/errors/CustomError');

/**
 * Class User contains properties and methods for working with users.
 */
class User {

    constructor(userId, username, passwordHash) {
        this.userId = userId;
        this.username = username;
        this.passwordHash = passwordHash;
    }

    /**
     * Finds user by id.
     * @param userId
     * @returns {Promise<User>}
     */
    static async findById(userId) {
        let result;
        try {
            result = await mainDb.query('SELECT ' +
                'u.user_id, ' +
                'u.username, ' +
                'u.password_hash ' +
                'FROM user u ' +
                'WHERE u.user_id = ?', [
                userId
            ]);
        } catch (err) {
            throw new Error(err);
        }
        if (result.length === 0) {
            throw new CustomError('Specified user could not be found');
        }
        let user = result[0];
        return new User(user.user_id, user.username, user.password_hash);
    }

    /**
     * Finds user by username and password hash.
     * @param username {string}
     * @param passwordHash {string}
     * @returns {Promise<User>}
     */
    static async findAllByUserCredentials(username, passwordHash) {
        let results;
        try {
            results = await mainDb.query('SELECT ' +
                'u.user_id, ' +
                'u.username, ' +
                'u.password_hash ' +
                'FROM user u ' +
                'WHERE u.username = ? AND u.password_hash = ?', [
                username, passwordHash
            ]);
        } catch (err) {
            throw new Error(err);
        }
        let users = [];
        results.forEach(function (el) {
            let user = new User(el.user_id, el.username, el.password_hash);
            users.push(user);
        });
        return users;
    }

    /**
     * Finds all users by specific field.
     * Column name must not be user-entered because it could allow SQL injections.
     * @param columnName {string}
     * @param columnValue {string}
     * @returns {Promise<User[]>}
     */
    static async findAllBy(columnName, columnValue) {
        let results;
        try {
            results = await mainDb.query('SELECT ' +
                'u.user_id, ' +
                'u.username, ' +
                'u.password_hash ' +
                'FROM user u ' +
                'WHERE u.' + columnName + ' = ?', [
                columnValue
            ]);
        } catch (err) {
            throw new Error(err);
        }
        let users = [];
        results.forEach(function (el) {
            let user = new User(el.user_id, el.username, el.password_hash);
            users.push(user);
        });
        return users;
    }

    /**
     * Adds user and returns number of affected rows.
     * @param user {User}
     * @returns {Promise<int>}
     */
    static async add(user) {
        let results;
        try {
            results = await mainDb.query('INSERT INTO user ' +
                '(username, password_hash) ' +
                'VALUES (?, ?)', [
                user.username, user.passwordHash
            ]);
        } catch (err) {
            throw new Error(err);
        }
        return results.affectedRows;
    }

    /**
     * Edits user and returns number of affected rows.
     * @param user {User}
     * @returns {Promise<int>} number of updated rows
     */
    static async update(user) {
        let results;
        try {
            results = await mainDb.query('UPDATE user SET ' +
                'username = ?, ' +
                'password_hash = ? ' +
                'WHERE user_id = ?', [
                user.username, user.passwordHash, user.userId
            ]);
        } catch (err) {
            throw new Error(err);
        }
        return results.affectedRows;
    }

}

module.exports = User;