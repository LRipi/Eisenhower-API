import * as node_geocoder from "node-geocoder";

const db = require('../database/db')
import bcrypt = require('bcrypt');
import jwt = require('jsonwebtoken');

import gmail = require('./Gmail');

//----------------------------------------------
//                  GETTERS                    |
//----------------------------------------------

/**
 * Get a user by his id
 * @param id
 * @returns {Promise<void>}
 */
export async function getUserById(id: number): Promise<void> {
    return await db('SELECT * FROM users WHERE id = ? LIMIT 1', id);
}

/**
 * Get all users
 * @returns {Promise<void>}
 */
export async function getAllUser(): Promise<void> {
    return await db('SELECT * FROM users');
}

/**
 * Get a user by his login
 * @param login
 * @returns {Promise<null>} if the result doesn't contain users
 * @returns {Promise<void>} if the result contain users
 */
export async function getUserByLogin(login: string): Promise<Promise<any> | null> {
    const result = await db('SELECT * FROM users WHERE login = ? LIMIT 1', login);
    return result ? result : null;
}

//----------------------------------------------
//                  SETTERS                    |
//----------------------------------------------

/**
 * Modify users information by an id
 * @param id
 * @param params
 * @return {Promise<void>}
 */
export async function modifyUserById(id: number, params: {
    password: string,
    name: string,
    login: string
}): Promise<string> {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(params.password, salt);
    await db('UPDATE users SET name = ?, login = ?, password = ? WHERE id = ?', [params.name, params.login, hash, id]);
    return hash;
}

/**
 * Delete an user from his id
 * @param id
 * @return {Promise<void>}
 */
export async function deleteUserById(id: number): Promise<void> {
    await db('DELETE FROM users WHERE id = ?', id);
}

/**
 * Create a new user
 * @param user
 * @return {Promise<void>}
 */
export async function createUser(user: {
    login: string,
    password: string,
    name: string,
    token: string,
    location: node_geocoder.Query
}): Promise<void> {
    const userExist: any = await getUserByLogin(user.login);
    if (userExist && userExist.length)
        throw {code: 409, message: 'User already exist.'};
    const salt: string = bcrypt.genSaltSync(8);
    const hash: string = bcrypt.hashSync(user.password, salt);
    await db('INSERT INTO users (name, login, password) VALUES (?, ?, ?)',
        [user.name, user.login, hash]);
    const userCreated = await getUserByLogin(user.login);
    user.token = jwt.sign({userRole: userCreated.role}, '2lfAtoo9hG', {expiresIn: 86400});
    const Gmail = new gmail(user.login);
    await Gmail.sendEmailConfirmation(`http://localhost:3002/?emailConfirmation=${userCreated[0].id}-${hash}`);
}

/**
 * Just update the password of the connected user after recovered it
 * @param userId
 * @param newPassword
 * @returns {Promise<void>}
 */
export async function updatePassword(userId: number, newPassword: string): Promise<void> {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newPassword, salt);
    await db('UPDATE users SET password = ? WHERE id = ?', [hash, userId]);
}
