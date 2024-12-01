"use server";

import { error } from "console";
import { redirect } from "next/navigation";
import validator from "validator";
import { z } from "zod";

const phoneSchema = z.string().trim().refine(phone =>  validator.isMobilePhone(phone, "ko-KR"), "Wrong phone format");


const tokenSchema = z.coerce.number().min(100000).max(999999);

interface ActionState {
  token : boolean;
}
export async function smsLogIn(prevState :ActionState, formData : FormData) {
  const phone = formData.get("phone");
  const token = formData.get("token");
  if(!prevState.token) {
    const result = phoneSchema.safeParse(phone);
    if(!result.success){
      return {
        token: false, 
        error: result.error.flatten()
      };

    } else {
      return {token : true};
    }
  } else {
    const tokenNumber = token ? parseInt(token.toString(), 10) : NaN;
    if (isNaN(tokenNumber)) {
      console.error('Token is not a number:', token);
      return { token: true };
    }
    const result = tokenSchema.safeParse(token); 
    if(!result.success) {
      return {
        token : true,
        error: result.error.flatten()
        // return errors 
      };
    } else {
      return redirect("/");
    }
  }
}