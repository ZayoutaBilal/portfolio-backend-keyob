import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ---------- Skills ----------
export const getSkills = async () => {
    return prisma.skill.findMany({ orderBy: { created_at: 'desc' } });
};

export const addSkill = async (skill: { name: string; category: string; level: number }) => {
    return prisma.skill.create({ data: skill });
};

export const updateSkill = async (id: number, skill: { name?: string; category?: string; level?: number }) => {
    return prisma.skill.update({ where: { id }, data: skill });
};

export const deleteSkill = async (id: number) => {
    return prisma.skill.delete({ where: { id } });
};

// ---------- Experiences ----------
export const getExperiences = async () => {
    const rows = await prisma.experience.findMany({ orderBy: { created_at: 'desc' } });
    return rows.map((r: { technologies: string; }) => ({ ...r, technologies: JSON.parse(r.technologies) }));
};

export const addExperience = async (exp: Omit<any, 'id' | 'created_at' | 'updated_at'>) => {
    return prisma.experience.create({
        data: { ...exp, technologies: JSON.stringify(exp.technologies)} as any
    });
};

export const updateExperience = async (id: number, exp: Partial<any>) => {
    const data = { ...exp };
    if (data.technologies) data.technologies = JSON.stringify(data.technologies);
    return prisma.experience.update({ where: { id }, data });
};

export const deleteExperience = async (id: number) => {
    return prisma.experience.delete({ where: { id } });
};

// ---------- Projects ----------
export const getProjects = async () => {
    const rows = await prisma.project.findMany({ orderBy: { created_at: 'desc' } });
    return rows.map((r: { technologies: string; }) => ({ ...r, technologies: JSON.parse(r.technologies) }));
};

export const addProject = async (proj: Omit<any, 'id' | 'created_at' | 'updated_at'>) => {
    return prisma.project.create({ data: { ...proj, technologies: JSON.stringify(proj.technologies) } as any});
};

export const updateProject = async (id: number, proj: Partial<any>) => {
    const data = { ...proj };
    if (data.technologies) data.technologies = JSON.stringify(data.technologies);
    return prisma.project.update({ where: { id }, data });
};

export const deleteProject = async (id: number) => {
    return prisma.project.delete({ where: { id } });
};

// ---------- KeyValues ----------
export const getAllKeyValues = async () => {
    return prisma.keyValue.findMany();
};

export const getValueByKey = async (key: string) => {
    return prisma.keyValue.findUnique({ where: { key } });
};

export const getValuesByKeys = async (keys: string[]) => {
    const results = await prisma.keyValue.findMany({
        where: {
            key: { in: keys },
        },
    });

    const data: Record<string, string> = {};
    results.forEach((item) => {
        data[item.key] = item.value;
    });

    return data;
};

export const addOrUpdateKeyValue = async (key: string, value: string) => {
    return prisma.keyValue.upsert({
        where: { key },
        create: { key, value },
        update: { value }
    });
};

export const deleteKeyValue = async (key: string) => {
    return prisma.keyValue.delete({ where: { key } });
};

export default prisma;