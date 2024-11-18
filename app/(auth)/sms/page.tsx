"use client";
import Input from '@/components/input';
import  Button from '@/components/button';
import React, { useActionState } from 'react'; // useFormState 대신 useActionState 사용
import { smsLogIn } from './actions';
import { error } from 'console';

const initialState =  {
    token: false,
    error: undefined,
};

export default function SMSLogin() {
    const [state , dispatch] = useActionState(smsLogIn, initialState)
    return (
        <div className="flex flex-col gap-10 py-8 px-6">
            <div className="flex flex-col gap-2 *:font-medium">
                <h1 className="text-2xl">SMSLogin </h1>
                <h2 className="text-xl">Verify your phone number</h2>
            </div>
            <form action ={dispatch} className="flex flex-col gap-3">
                { state?.token ? (
                    < Input 
                    name='token'
                    type="text" 
                    placeholder="Verification code" 
                    required 
                    min = {100000}
                    max = {999999}
                /> 
                ) :   (  
                <Input 
                name='phone'
                type="number" 
                placeholder="Phone number" 
                required 
                errors={state.error?.formErrors}
            />
        )}
                <Button 
                    text={state.token ? "Verify Token" : "Send Verification SNS"} 
                />
            </form>
        </div>
    );
}
