'use strict';

export async function getTaskById(id_user: number, id: number): Promise<any> {

}

export async function getAllUserTasks(id_user: number): Promise<any> {

}

export async function addTasks(data: {
    id_user: number,
    urgence: number,
    importance: number,
    title: string,
    description: string,
    deadline: Date
}): Promise<any> {

}

export async function updateTasks(id: number, data: {
    urgence: number,
    importance: number,
    title: string,
    description: string,
    deadline: Date
}): Promise<any> {

}

export async function deleteTasks(id: number): Promise<any> {

}
