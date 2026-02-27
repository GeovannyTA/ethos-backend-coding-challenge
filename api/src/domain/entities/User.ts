// Entidad de usuario

export class User {
    constructor(
        public  readonly id: string ,
        public email: string,
        public password: string,
        public first_name: string,
        public last_name: string
    ) {}
}