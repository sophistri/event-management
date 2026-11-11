export interface User{
    id: string;
    email: string;
    username: string;
    name: string;
    // dont add password hash cause we dont want the client to know the password hash
}

export interface SignupInput{
    email: string;
    username: string;
    password: string;
    name: string;
}

export interface LoginCredentials{
    identifier: string;
    password: string;
}