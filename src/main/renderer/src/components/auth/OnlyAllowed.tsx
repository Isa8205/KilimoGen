import { sessionState } from "@/store/store"
import React, { ReactElement } from "react"
import { useRecoilState } from "recoil"

interface OnlyAllowedProps {
    levels: string[]
    children: ReactElement
}
const OnlyAdmin: React.FC<OnlyAllowedProps> = ({children, levels}) => {
    const user = useRecoilState(sessionState)[0]

    if (!levels.includes(user?.role as any)) {
        return
    }

    return (
        <div>
            {React.cloneElement(children)}
        </div>
    )
}

export default OnlyAdmin