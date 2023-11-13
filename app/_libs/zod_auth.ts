import { z } from 'zod';

export type TEmailSchema = z.infer<typeof emailSchema>;
export const emailSchema = z.string().min(1).email();

export type TPasswordSchema = z.infer<typeof passwordSchema>;
export const passwordSchema = z.string().min(8, {message: "Password must have minimum length of 8 !"});


export type TSignUpSchema = z.infer<typeof signUpSchema>;

export const signUpSchema = z.object({
    user_uid: z.string().min(1).uuid(),
    email: emailSchema,
    password: passwordSchema,
    role: z.enum(["user", "admin", "boss"]),
    user_createdAt: z.coerce.date(),
    user_updatedAt: z.coerce.date(),
});


export type TSignInSchema = z.infer<typeof signInSchema>;

export const signInSchema = signUpSchema.pick({
    email: true,
    password: true,
});



export type TReadUserSchema = z.infer<typeof readUserSchema>;

export const readUserSchema = signUpSchema.omit({
    user_createdAt: true,
    user_updatedAt: true,
});



export type TReadUserWithoutPassSchema = z.infer<typeof readUserWithoutPassSchema>;

export const readUserWithoutPassSchema = readUserSchema.omit({
    password: true,
});



export type TUpdateUserSchema = z.infer<typeof updateUserSchema>;

export const updateUserSchema = signUpSchema.pick({
    user_uid: true,
    password: true,
    user_updatedAt: true,
});



export type TDeleteUserSchema = z.infer<typeof deleteUserSchema>;

export const deleteUserSchema = signUpSchema.pick({
    user_uid: true,
});



export type TUpdateRoleSchema = z.infer<typeof updateRoleSchema>;

export const updateRoleSchema = signUpSchema.pick({
    user_uid: true,
    role: true,
    user_updatedAt: true,
});