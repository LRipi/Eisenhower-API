'use strict';

const db = require('../database/db')

export async function getTaskByParameter(id_user: number, query: any): Promise<any> {
    let sql = 'SELECT * FROM tasks WHERE id_user = ?';
    sql += query.importance === 'true' ? ' AND importance >= 5 ' : ' AND importance < 5 ';
    sql += query.urgence === 'true' ? ' AND urgence >= 5 ' : ' AND urgence < 5 ';
    return await db(sql, id_user)
}

export async function getAllUserTasks(id_user: number): Promise<any> {
    return await db('SELECT * FROM tasks WHERE id_user = ?', id_user)
}

export async function getNumberUserTasks(id_user: number, importance: string, urgence: string): Promise<any> {
    let sql: string = 'SELECT COUNT(*) AS number_tasks FROM tasks WHERE id_user = ?';
    sql += importance === 'true' ? ' AND importance >= 5 ' : ' AND importance < 5 ';
    sql += urgence === 'true' ? ' AND urgence >= 5 ' : ' AND urgence < 5 ';
    return await db(sql, id_user);
}

export async function addTasks(data: {
    id_user: number,
    urgence: number,
    importance: number,
    title: string,
    description: string,
    deadline: Date,
    status: string
}): Promise<any> {
    try {
        await db(`INSERT INTO tasks (id_user, urgence, importance, title, description, deadline, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)`, [data.id_user, data.urgence, data.importance,
            data.title, data.description, data.deadline, data.status])
    } catch (e) {
        throw e;
    }
}

export async function updateTasks(id: number, data: {
    urgence: number,
    importance: number,
    title: string,
    description: string,
    deadline: Date,
    status: string
}): Promise<any> {
    try {
        await db('UPDATE tasks SET status = ?, urgence = ?, importance = ?, title = ?, description = ?, deadline = ? WHERE id = ?',
            [data.status, data.urgence, data.importance, data.title, data.description, data.deadline, id])
    } catch (e) {
        throw e;
    }
}

export async function deleteTasks(id: number): Promise<any> {
    await db('DELETE FROM tasks WHERE id = ?', id)
}
