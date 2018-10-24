const mainDb = require('../database/main');
const CustomError = require('../app/errors/CustomError');

/**
 * Class UserLike contains properties and methods for working with user likes.
 */
class UserLike {

    constructor(userId, likeUserId) {
        this.userId = userId;
        this.likeUserId = likeUserId;
    }

    /**
     * Gets count of user likes by id.
     * @param userId
     * @returns {Promise<int>}
     */
    static async countById(userId) {
        let result;
        try {
            result = await mainDb.query('SELECT ' +
                'COUNT(ul.like_user_id) AS c ' +
                'FROM user_like ul ' +
                'WHERE ul.like_user_id = ?', [
                userId
            ]);
        } catch (err) {
            throw new Error(err);
        }
        if (result.length === 0) {
            return 0;
        }
        return result[0].c;
    }

    /**
     * Finds all users ordered by most liked.
     * @returns {Promise}
     */
    static async getAllMostLiked() {
        let results;
        try {
            results = await mainDb.query('SELECT ' +
                'ul.like_user_id, ' +
                'u.username, ' +
                'COUNT(ul.like_user_id) AS c ' +
                'FROM user_like ul ' +
                'LEFT JOIN user u ON u.user_id = ul.like_user_id ' +
                'GROUP BY ul.like_user_id, u.username ' +
                'ORDER BY c DESC');
        } catch (err) {
            throw new Error(err);
        }
        let userLikes = [];
        results.forEach(function (el) {
            let userLikeCount = {
                userId: el.like_user_id,
                username: el.username,
                likeCount: el.c
            };
            userLikes.push(userLikeCount);
        });
        return userLikes;
    }

    /**
     * Adds user like and returns number of affected rows.
     * @param userLike {UserLike}
     * @returns {Promise<int>}
     */
    static async add(userLike) {
        let results;
        try {
            results = await mainDb.query('INSERT INTO user_like ' +
                '(user_id, like_user_id) ' +
                'VALUES (?, ?)', [
                userLike.userId, userLike.likeUserId
            ]);
        } catch (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                throw new CustomError('User already liked');
            }
            throw new Error(err);
        }
        return results.affectedRows;
    }

    /**
     * Removes user like and returns number of affected rows.
     * @param userLike {UserLike}
     * @returns {Promise<int>} number of updated rows
     */
    static async remove(userLike) {
        let results;
        try {
            results = await mainDb.query('DELETE FROM user_like WHERE ' +
                'user_id = ? AND like_user_id = ?', [
                userLike.userId, userLike.likeUserId
            ]);
        } catch (err) {
            throw new Error(err);
        }
        return results.affectedRows;
    }

}

module.exports = UserLike;