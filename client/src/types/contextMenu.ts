import { Dispatch, SetStateAction } from 'react'

export type contextMenuStateI = {
    isOpen: boolean,
    item?: ({
        clientX: number,
        clientY: number
    } & ({
        type: contextMenuActionType.GROUP,
        _id: string,
        position: number
    } | {
        type: contextMenuActionType.LIST,
        _id: string,
        name: string,
        forGroup?: string,
        clientX: number,
        clientY: number,
        position: number
    } | {
        type: contextMenuActionType.TASK,
        _id: string,
        name: string,
        myDay?: null | number,
        isCompleted: boolean,
        favourites?: null | number,
        endAt?: [number, number, number],
        forList: string | undefined,
        clientX: number,
        clientY: number,
        position: number | null
    })) | {
        type: contextMenuActionType.CHOOSE_DATE,
        offsetWidth: number,
        offsetHeight: number,
        width: number,
        height: number,
        setDate: Dispatch<SetStateAction<chooseDateType | undefined>>,
        fullDate?: chooseDateType
    }
}

export enum contextMenuActionType {
    GROUP = '@contextMenu/GROUP',
    LIST = '@contextMenu/LIST',
    TASK = '@contextMenu/TASK',
    CLEAR_CONTEXT_MENU = '@contextMenu/CLEAR_CONTEXT_MENU',
    CHOOSE_DATE = '@contextMenu/CHOOSE_DATE'
}

export interface GroupContextMenu {
    type: contextMenuActionType.GROUP,
    payload: {
        _id: string,
        name: string,
        clientX: number,
        clientY: number,
        position: number
    }
}

export interface ListContextMenu {
    type: contextMenuActionType.LIST,
    payload: {
        _id: string,
        name: string,
        forGroup?: string,
        clientX: number,
        clientY: number,
        position: number
    }
}

export interface TaskContextMenu {
    type: contextMenuActionType.TASK,
    payload: {
        _id: string,
        name: string,
        myDay?: null | number,
        isCompleted: boolean,
        favourites?: null | number,
        endAt?: [number, number, number],
        forList: string | undefined,
        clientX: number,
        clientY: number,
        position: number | null
    }
}

export interface ChooseDateContextMenu {
    type: contextMenuActionType.CHOOSE_DATE,
    payload: {
        offsetWidth: number,
        offsetHeight: number,
        width: number,
        height: number,
        setDate: Dispatch<SetStateAction<chooseDateType | undefined>>,
        fullDate?: chooseDateType
    }
}

export interface ClearContextMenu {
    type: contextMenuActionType.CLEAR_CONTEXT_MENU
}

export interface chooseDateType {
    year: number,
    month: number,
    day: number
}

export type contextMenuActionI =
    GroupContextMenu
    | ListContextMenu
    | TaskContextMenu
    | ChooseDateContextMenu
    | ClearContextMenu
