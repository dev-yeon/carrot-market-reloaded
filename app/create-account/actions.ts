'use server';
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX, PASSWORD_REGEX_ERROR } from '@/lib/constants';
import db from '@/lib/db';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import getSession from '@/lib/session';

// At least one uppercase letter, one lowercase letter, one number and one special character

const checkPasswords = ({ password, confirm_password }: { password: string; confirm_password: string }) =>
    password === confirm_password;

const checkUniqueUsername = async (username: string) => {
    const user = await db.user.findUnique({
        where: {
            username
        },
        select: {
            id: true
        }
    });
    return !Boolean(user);
};

const checkUniqueEmail = async (email: string) => {
    const user = await db.user.findUnique({
        where: {
            email
        },
        select: {
            id: true
        }
    });
    return !Boolean(user);
    // user을 찾으면 false, 못 찾으면 true를 반환함.
};

const formSchema = z
    .object({
        username: z
            .string({
                invalid_type_error: ' Username must be a string!',
                required_error: 'Where is my user name?'
            })
            .toLowerCase()
            .trim()
            // .transform((username)=>`🍓 ${username}`)
            .refine(checkUniqueUsername, 'This username is already taken.'),
        email: z
            .string()
            .email()
            .trim()
            .toLowerCase()
            .refine(checkUniqueEmail, 'There is an account already registered with that email.'),
        password: z.string().min(PASSWORD_MIN_LENGTH),
        // .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
        confirm_password: z.string().min(PASSWORD_MIN_LENGTH)
    })
    .refine(checkPasswords, {
        message: 'Both password should be the same!',
        path: ['confirm_password']
    });

export async function createAccount(prevState: any, formData: FormData) {
    console.log(cookies());
    const data = {
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirm_password: formData.get('confirm_password')
    };
    const result = await formSchema.safeParseAsync(data);
    if (!result.success) {
        console.log(result.error.flatten());
        return result.error.flatten();
    } else {
        const hashedPassword = await bcrypt.hash(result.data.password, 12);

        const user = await db.user.create({
            data: {
                username: result.data.username,
                email: result.data.email,
                password: hashedPassword
            },
            select: {
                id: true
            }
        });
        // log the user in
        // const cookieStore = await cookies();
        const session = await getSession();

        session.id = user.id;
        //redirect "/home"
        await session.save();
        redirect('/profile');
    }
}
