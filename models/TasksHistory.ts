'use strict';

export async function getTaskById(id_user: number, id: number): Promise<any> {

}

export async function getAllUserTasks(id_user: number): Promise<any> {

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

}
