import { AppDataSource } from "@/main/database/src/data-source";
import { getSessionCookie } from "@/main/electron/session/cookieManager";
import { Session } from "@/main/database/src/entities/Session";

const getSessionUser = async () => {
    try {
        const id: any = await getSessionCookie();
        const sessionRepository = AppDataSource.getRepository(Session);
        if (id) {
            const data: any = await sessionRepository.findOneBy({ id: id });
            const user = JSON.parse(data?.data)
            return user
        }  else {
            return null
        }
    } catch (err) {
        console.log("Error retreiving session: ", err);
    }
}

export default getSessionUser