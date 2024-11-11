"use client"
import React, { useActionState } from "react"; 
import FormInput from '@/components/form-input';
import FormButton from '@/components/form-btn';
import SocialLogin from '@/components/social-login';
 
import { createAccount } from './actions';

export default function CreateAccount() {
    const [state, dispatch] = useActionState(createAccount, null);
    return (
        <div className="flex flex-col gap-10 py-8 px-6">
            <div className="flex flex-col gap-2 *:font-medium">
                <h1 className="text-2xl">안녕하세요!</h1>
                <h2 className="text-xl">Log in with email and password</h2>
            </div>
            <form action={dispatch} className="flex flex-col gap-3">
                <FormInput 
                    name='username' 
                    type="text" 
                    placeholder="Username" 
                    required  
                />
                <FormInput 
                    name="email" 
                    type="email" 
                    placeholder="Email" 
                    required  
                />
                <FormInput 
                    name="password"
                    type="password" 
                    placeholder="Password" 
                    required  
                />
                <FormInput 
                    name="confirm_password"
                    type="password" 
                    placeholder="Confirm Password" 
                    required 
               
                />

                <FormButton  text="Create account" />
            </form>
            <SocialLogin />
        </div>
    );
}
