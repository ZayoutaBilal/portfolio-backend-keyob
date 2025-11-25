export interface Skill {
    id: number;
    name: string;
    category: string;
    level: number;
    created_at: Date;
    updated_at?: Date;
}