import * as React from 'react'
import { Dispatch } from 'react'
import s from './Header.module.css'
import { useTypedSelector } from '../../../../../hooks/useTypedSelector'
import {
    closeRightSidebarActionCreator,
    toggleProfileActionCreator,
    openSettingsActionCreator
} from '../../../../../store/actionsCreator/extensibilityActionCreator'
import { useDispatch } from 'react-redux'
import { ExtensibilityActionI, ExtensibilityRightSidebarId } from '../../../../../types/Extensibility'

const Header: React.FC = () => {
    const dispatch = useDispatch<Dispatch<ExtensibilityActionI>>()
    const username = useTypedSelector(state => state.auth.userData?.username)
    const rightSidebarId = useTypedSelector(state => state.extensibilityState.rightSidebarId)
    if ( !username ) {
        window.location.reload()
        return <></>
    }

    const username_arr = username.split(' ')
    const chars_for_profile = username_arr.length >= 2 ?
        username_arr[ 0 ][ 0 ] + username_arr[ 1 ][ 0 ]
        :
        username[ 0 ] + username[ 1 ]

    const settingsClickHandler = () => {
        if ( !rightSidebarId || rightSidebarId.type !== ExtensibilityRightSidebarId.SETTINGS ) {
            dispatch(openSettingsActionCreator())
        } else {
            dispatch(closeRightSidebarActionCreator())
        }
    }

    const profileClickHandler = ( e: React.MouseEvent<HTMLDivElement, MouseEvent> ) => {
        e.stopPropagation()
        dispatch(toggleProfileActionCreator())
    }

    return (
        <header>
            <div className={ s.site_name_and_logo }>
                <div onClick={ () => window.location.reload() } className={ s.site_logo_wrapper }>
                    <svg width="20" height="20" viewBox="0 0 32 32" fill="white">
                        <path fillRule="evenodd" clipRule="evenodd" d="M31 0H9C8.447 0 8 0.447433 8
                        1.00097V23.9922H4C1.794 23.9922 0 25.788 0 27.9961V30.999C0 31.5526 0.447 32 1 32H19C19.553 32
                        20 31.5526 20 30.999V27.9961C20 26.8921 20.897 25.9942 22 25.9942C23.103 25.9942 24 26.8921 24
                        27.9961C24 30.2043 25.794 32 28 32C30.206 32 32 30.2043 32 27.9961V1.00097C32 0.448434 31.553 0
                        31 0ZM18 27.9961V29.9981H2V27.9961C2 26.8921 2.897 25.9942 4 25.9942H18.537C18.195 26.5838 18
                        27.2674 18 27.9961ZM14 19.9884H26V17.9864H14V19.9884ZM26 13.9825H14V11.9806H26V13.9825ZM14
                        7.97673H26V5.97479H14V7.97673Z"/>
                    </svg>
                </div>
                <h6 onClick={ () => window.location.reload() } className={ s.site_name }>To Do</h6>
            </div>
            <div/>
            <div className={ s.right_side }>
                <div onClick={ settingsClickHandler } className={ s.settings }>
                    <svg height="18px" viewBox="0 0 48 48" width="18px" x="0" fill="white" y="0">
                        <g>
                            <g>
                                <g>
                                    <path d="M26,48h-4c-1.654,0-3-1.346-3-3v-3.724c-1.28-0.37-2.512-0.881-3.681-1.527l-2.634,2.635 c-1.134,
                                    1.134-3.109,1.132-4.243,0l-2.829-2.828c-0.567-0.566-0.879-1.32-0.879-2.121s0.312-1.555,
                                    0.879-2.121l2.635-2.636 c-0.645-1.166-1.156-2.398-1.525-3.679H3c-1.654,0-3-1.346-3-3v-4c0-0.802,0.312-1.555,
                                    0.878-2.121 c0.567-0.566,1.32-0.879,2.122-0.879h3.724c0.37-1.278,0.88-2.511,
                                    1.526-3.679l-2.634-2.635c-1.17-1.17-1.17-3.072,0-4.242 l2.828-2.829c1.133-1.132,3.109-1.134,4.243,0l2.635,
                                    2.635C16.49,7.604,17.722,7.093,19,6.724V3c0-1.654,1.346-3,3-3h4 c1.654,0,3,1.346,3,3v3.724c1.28,0.37,2.512,
                                    0.881,3.678,1.525l2.635-2.635c1.134-1.132,3.109-1.134,4.243,0l2.829,2.828 c0.567,0.566,0.879,1.32,0.879,
                                    2.121s-0.312,1.555-0.879,2.121l-2.634,2.635c0.646,1.168,1.157,2.4,1.526,3.68H45 c1.654,0,3,1.346,3,3v4c0,
                                    0.802-0.312,1.555-0.878,2.121s-1.32,0.879-2.122,0.879h-3.724c-0.37,1.28-0.881,2.513-1.526,3.68 l2.634,
                                    2.635c1.17,1.17,1.17,3.072,0,4.242l-2.828,2.829c-1.134,1.133-3.109,1.133-4.243,0L32.68,39.75 c-1.168,
                                    0.646-2.401,1.156-3.679,1.526V45C29,46.654,27.655,48,26,48z M15.157,37.498c0.179,0,0.36,0.048,0.521,0.146
                                    c1.416,0.866,2.949,1.502,4.557,1.891C20.684,39.644,21,40.045,21,40.507V45c0,0.552,0.449,1,1,1h4c0.551,0,
                                    1-0.448,1-1v-4.493 c0-0.462,0.316-0.863,0.765-0.972c1.606-0.389,3.139-1.023,4.556-1.89c0.396-0.241,
                                    0.902-0.18,1.229,0.146l3.178,3.179 c0.375,0.374,1.039,0.376,1.415,0l2.828-2.829c0.39-0.39,0.39-1.024,
                                    0-1.414l-3.179-3.179c-0.327-0.326-0.387-0.835-0.146-1.229 c0.865-1.414,1.5-2.947,1.889-4.556c0.108-0.449,
                                    0.51-0.766,0.972-0.766H45c0.267,0,0.519-0.104,0.708-0.293 C45.896,26.518,46,26.267,46,
                                    25.999v-4c0-0.552-0.449-1-1-1h-4.493c-0.462,0-0.864-0.316-0.972-0.766
                                    c-0.388-1.607-1.023-3.14-1.889-4.556c-0.241-0.394-0.181-0.901,0.146-1.229l3.179-3.179c0.186-0.187,
                                    0.293-0.444,0.293-0.707 s-0.107-0.521-0.293-0.707l-2.829-2.828c-0.378-0.377-1.037-0.377-1.415,0l-3.179,
                                    3.179c-0.326,0.328-0.833,0.389-1.229,0.146 c-1.413-0.864-2.945-1.5-4.554-1.889C27.317,8.356,27,7.955,27,
                                    7.493V3c0-0.552-0.449-1-1-1h-4c-0.551,0-1,0.448-1,1v4.493 c0,0.462-0.316,0.863-0.765,0.972c-1.606,
                                    0.388-3.139,1.023-4.556,1.889c-0.395,0.241-0.902,0.181-1.228-0.146l-3.179-3.179
                                    c-0.378-0.377-1.037-0.377-1.415,0L7.03,9.857c-0.39,0.39-0.39,1.024,0,1.414l3.179,3.179c0.327,0.326,0.387,
                                    0.835,0.146,1.229 c-0.866,1.416-1.501,2.949-1.889,4.555c-0.108,0.449-0.51,0.766-0.972,0.766H3c-0.267,
                                    0-0.519,0.104-0.708,0.293 C2.104,21.48,2,21.731,2,21.999v4c0,0.552,0.449,1,1,1h4.493c0.462,0,0.864,
                                    0.316,0.972,0.766 c0.389,1.608,1.024,3.141,1.889,4.555c0.241,0.394,0.181,0.901-0.146,1.229l-3.179,
                                    3.18c-0.186,0.187-0.293,0.444-0.293,0.707 s0.107,0.521,0.293,0.707l2.829,2.828c0.377,0.377,1.037,
                                    0.377,1.415,0l3.178-3.179C14.643,37.598,14.898,37.498,15.157,37.498z"/>
                                </g>
                                <g>
                                    <path d="M24,34c-5.514,0-10-4.486-10-10s4.486-10,10-10s10,4.486,10,10S29.515,34,24,34z M24,16c-4.411,
                                    0-8,3.589-8,8 s3.589,8,8,8s8-3.589,8-8S28.412,16,24,16z"/>
                                </g>
                            </g>
                        </g>
                    </svg>
                </div>
                <div onClick={ profileClickHandler } className={ s.profile }>
                    { chars_for_profile.toUpperCase() }
                </div>
            </div>
        </header>
    )
}

export default Header