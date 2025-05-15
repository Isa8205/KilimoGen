import { sessionState } from "@/store/store";
import notify from "@/utils/ToastHelper";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";

  //Session management
  interface sessionResponse {
    passed: boolean;
    user?: {id: number, firstName: string, lastName: string, username: string, avatar: string};
    message: string;
  }
  
  async function getSession () {
    const navigate = useNavigate()
    const [user, setSessionData] = useRecoilState<{
    id?: number;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    } | null>(sessionState);
      
    const response = await window.electron.invoke('check-session')
    if (response.user) {
      setSessionData(response.user);
      notify(true,  `Welcome back ${user?.firstName}!`)
    } else {
      navigate('/auth/clerks/login')
    }
  };

  export default getSession