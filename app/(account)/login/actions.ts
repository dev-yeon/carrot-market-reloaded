'use server';

import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX, PASSWORD_REGEX_ERROR } from '@/lib/constants';
import db from '@/lib/db';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import getSession from '@/lib/session';
import { redirect } from 'next/navigation';
import UpdateSession from "@/lib/session/updateSession";
const checkEmailExists = async (email: string) => {
    const user = await db.user.findUnique({
        where: {
            email
        },
        select: {
            id: true
        }
    });
    return Boolean(user);
};

const formSchema = z.object({
    email: z.string().email().toLowerCase().refine(checkEmailExists, 'An account with this email does not exist.'),
    password: z.string({
        required_error: 'Password is Required.'
    })
    // .min(PASSWORD_MIN_LENGTH)
    // .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR)
});

export async function login(prevState: any, formData: FormData) {
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    const data = {
        email: formData.get('email'),
        password: formData.get('password')
    };
    const result = await formSchema.spa(data);
    if (!result.success) {
        // return result.error.flatten();
    } else {
        //데이터 검증이 끝난 곳.
        //find a user with the email
        // if the user is found , ch eck password hash
        const user = await db.user.findUnique({
            where: {
                email: result.data.email
            },
            select: {
                id: true,
                password: true
            }
        });
        const passwordOk = await bcrypt.compare(result.data.password, user!.password ?? 'null password');
  

        if (passwordOk) {
            //log the user in!
            // const session = await getSession();
            // session.id = user!.id;
            // await session.save(); // session을 변경할때마다 cookie에 유지
            await UpdateSession(user!.id);
            redirect('/profile');
        } else {
            return {
                fieldErrors: {
                    password: ['Wrong Password.'],
                    email: []
                }
            };
        }

        // redirect "/profile"
    }
}
