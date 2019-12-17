'use strict';

const db = require('../database/db')

export async function getTaskById(id_user: number, id: number): Promise<any> {
    return await db('SELECT * FROM tasks WHERE id = ? AND id_user = ?', [id, id_user])
}

export async function getAllUserTasks(id_user: number): Promise<any> {
    return await db('SELECT * FROM tasks WHERE id_user = ?', id_user)
}

export async function addTasks(data: {
    id_user: number,
    urgence: number,
    importance: number,
    title: string,
    description: string,
    deadline: Date
}): Promise<any> {
    try {
        await db('INSERT INTO tasks VALUES (?)', [data])
    } catch (e) {
        throw e;
    }
}

export async function updateTasks(id: number, data: {
    urgence: number,
    importance: number,
    title: string,
    description: string,
    deadline: Date
}): Promise<any> {
    try {
        await db('UPDATE tasks SET urgence = ?, importance = ?, title = ?, description = ?, deadline = ? WHERE id = ?',
            [data.urgence, data.importance, data.title, data.description, data.deadline, id])
    } catch (e) {
        throw e;
    }
}

export async function deleteTasks(id: number): Promise<any> {
    await db('DELETE FROM tasks WHERE id = ?', id)
}
