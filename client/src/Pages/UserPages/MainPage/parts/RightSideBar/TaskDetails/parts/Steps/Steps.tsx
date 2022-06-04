import * as React from 'react'
import { useTypedSelector } from '../../../../../../../../hooks/useTypedSelector'
import Step from './Step/Step'
import Line from '../../../../../../../../Components/Line/Line'
import { useState } from 'react'

interface Props {
    taskId: string,
    interfaceRGB: interfaceColor.RED | interfaceColor.BLUE
}

export enum interfaceColor {
    BLUE = 'rgb(37, 100, 207)',
    RED = 'rgb(210, 83, 78)'
}

const Steps: React.FC<Props> = ( { taskId, interfaceRGB } ) => {
    const steps = useTypedSelector(state => state.todoUserData.steps)
        .filter(el => el.forTask === taskId)
        .sort(( a, b ) => a.position - b.position)
    const [chosenStepId, setChosenStepId] = useState<string>('')
    return (
        <>
            { !!steps.length &&
                <Line
                    key={ taskId + 'stepFirstLine' }
                    position={ 0 }
                    forTask={ taskId }
                    locked={ false }
                />
            }
            {
                steps.map(( el, inx ) =>
                    <React.Fragment key={ el._id + 'fragment' }>
                        <Step
                            key={ el._id }
                            { ...el }
                            interfaceRGB={ interfaceRGB }
                            chosenStepId={ chosenStepId }
                            setChosenStepId={ setChosenStepId }
                        />
                        <Line
                            key={ taskId + 'stepFirstLine' }
                            position={ inx + 1 }
                            forTask={ taskId }
                            locked={ false }
                        />
                    </React.Fragment>
                )
            }
        </>
    )
}

export default Steps