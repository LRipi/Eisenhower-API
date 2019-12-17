'use strict';

const db = require('../database/db')

export async function getTaskById(id_user: number, id: number): Promise<any> {
    return await db('SELECT * FROM tasks_history WHERE id = ? AND id_user = ?', [id, id_user])
}

export async function getAllUserTasks(id_user: number): Promise<any> {
    return await db('SELECT * FROM tasks_history WHERE id_user = ?', id_user)
}

export async function addTasksHistory(data: {
    id: number
    id_user: number,
    urgence: number,
    importance: number,
    title: string,
    description: string,
    deadline: Date,
    status: string,
    date_creation: Date
}): Promise<any> {
    try {
        await db(`INSERT INTO tasks_history (id_user, urgence, importance, title, description, deadline, status, date_creation)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [data.id_user, data.urgence, data.importance,
            data.title, data.description, data.deadline, data.status, data.date_creation])
    } catch (e) {
        throw e;
    }
}
