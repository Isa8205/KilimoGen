import { configDotenv } from "dotenv";

configDotenv();
export default function sendSms(phone: string | string[], message: string): any {
    let response;
    (async () => {
        const body = JSON.stringify({ phone, message });
        const res = await fetch(`${process.env.API_URL}/send-sms`, { method: "POST", headers: { "Content-Type": "application/json" }, body: body });
        response = res
    })();
    return response
}