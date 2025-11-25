export interface Experience {
    id: number;
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
    technologies: string[];
    created_at: Date;
    updated_at?: Date;
}