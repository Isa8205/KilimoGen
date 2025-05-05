import { sessionState } from "@/store/store"
import React, { ReactElement } from "react"
import { useRecoilState } from "recoil"

interface OnlyAdminProps {
    children: ReactElement
}
const OnlyAdmin: React.FC<OnlyAdminProps> = ({children}) => {
    const user = useRecoilState(sessionState)[0]

    if (user?.role !== 'Admin') {
        return
    }

    return (
        <div>
            {React.cloneElement(children)}
        </div>
    )
}

export default OnlyAdmin