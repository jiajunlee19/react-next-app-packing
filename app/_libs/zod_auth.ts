import { z } from 'zod';

export type TEmailSchema = z.infer<typeof emailSchema>;
export const emailSchema = z.string().toLowerCase().min(1).email();

export type TPasswordSchema = z.infer<typeof passwordSchema>;
export const passwordSchema = z.string().min(8, {message: "Password must have minimum length of 8 !"});

export type TRoleSchema = z.infer<typeof roleSchema>;
export const roleSchema = z.enum(["user", "admin", "boss"]);

export type TRoleWithoutBossSchema = z.infer<typeof roleWithoutBossSchema>;
export const roleWithoutBossSchema = z.enum(["user", "admin"]);


export type TSignUpSchema = z.infer<typeof signUpSchema>;

export const signUpSchema = z.object({
    user_uid: z.string().toLowerCase().min(1).uuid(),
    email: emailSchema,
    password: passwordSchema,
    role: roleSchema,
    user_created_dt: z.coerce.date(),
    user_updated_dt: z.coerce.date(),
});


export type TSignInSchema = z.infer<typeof signInSchema>;

export const signInSchema = signUpSchema.pick({
    email: true,
    password: true,
});



export type TReadUserSchema = z.infer<typeof readUserSchema>;

export const readUserSchema = signUpSchema.omit({
    user_created_dt: true,
    user_updated_dt: true,
});



export type TReadUserWithoutPassSchema = z.infer<typeof readUserWithoutPassSchema>;

export const readUserWithoutPassSchema = readUserSchema.omit({
    password: true,
});


export type TReadUserWithoutPassAdminSchema = z.infer<typeof readUserWithoutPassAdminSchema>;

export const readUserWithoutPassAdminSchema = readUserSchema.omit({
    password: true,
    role: true,
}).extend({
    role: roleWithoutBossSchema,
});


export type TUpdateUserSchema = z.infer<typeof updateUserSchema>;

export const updateUserSchema = signUpSchema.pick({
    user_uid: true,
    password: true,
    user_updated_dt: true,
});



export type TDeleteUserSchema = z.infer<typeof deleteUserSchema>;

export const deleteUserSchema = signUpSchema.pick({
    user_uid: true,
});



export type TUpdateRoleSchema = z.infer<typeof updateRoleSchema>;

export const updateRoleSchema = signUpSchema.pick({
    user_uid: true,
    role: true,
    user_updated_dt: true,
});

export type TUpdateRoleAdminSchema = z.infer<typeof updateRoleAdminSchema>;

export const updateRoleAdminSchema = signUpSchema.pick({
    user_uid: true,
    user_updated_dt: true,
}).extend({
    role: roleWithoutBossSchema,
});