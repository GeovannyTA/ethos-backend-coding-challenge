export class Project {
    constructor(
        public  readonly id: string,
        public name: string,
        public description: string,
        public user_id: string,
        public status: string,
        public created_at: Date,
    ) {}
}

export class ProjectResponse {
    constructor(
        public id: string,
        public name: string,
        public description: string,
        public user_id: string,
    ) {}
}