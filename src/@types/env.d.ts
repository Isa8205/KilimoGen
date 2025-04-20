declare namespace NodeJs {
    interface Process {
        env: {
            SECRET_KEY: string;
            NODE_ENV: "development" | "production";
            [key: string]: string;
        };
    }
}

export {}