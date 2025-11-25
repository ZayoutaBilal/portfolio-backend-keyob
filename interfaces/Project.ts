export interface Project {
    id: number;
    title: string;
    description: string;
    technologies: string[];
    githubUrl: string;
    liveUrl?: string;
    image?: string;
    created_at: Date;
    updated_at?: Date;
}