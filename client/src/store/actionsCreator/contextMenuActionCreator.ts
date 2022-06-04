import {
    ChooseDateContextMenu,
    chooseDateType,
    ClearContextMenu,
    contextMenuActionType,
    GroupContextMenu,
    ListContextMenu,
    TaskContextMenu
} from '../../types/contextMenu'
import { Dispatch, SetStateAction } from 'react'

export const groupContextMenuActionCreator =
    ( payload: {
        clientX: number, clientY: number, _id: string, name: string, position: number
    } ): GroupContextMenu => ({
        type : contextMenuActionType.GROUP,
        payload
    })

export const listContextMenuActionCreator =
    ( payload: {
        clientX: number, clientY: number, _id: string, name: string, forGroup?: string, position: number
    } ): ListContextMenu => ({
        type : contextMenuActionType.LIST,
        payload
    })

export const taskContextMenuActionCreator =
    ( payload: {
        _id: string, name: string, myDay?: null | number, isCompleted: boolean, favourites?: null | number,
        endAt?: [number, number, number], forList: string | undefined, clientX: number, clientY: number, position: number | null
    } ): TaskContextMenu => ({
        type : contextMenuActionType.TASK,
        payload
    })

export const chooseDateContextMenuActionCreator =
    ( payload: {
        offsetHeight: number, offsetWidth: number, width: number, height: number
        setDate: Dispatch<SetStateAction<chooseDateType | undefined>>, fullDate?: chooseDateType
    } ): ChooseDateContextMenu => ({
        type : contextMenuActionType.CHOOSE_DATE,
        payload
    })
export const clearContextMenuActionCreator = (): ClearContextMenu => ({
    type : contextMenuActionType.CLEAR_CONTEXT_MENU
})