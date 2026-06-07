import z from "zod"


export const registerSchema = z.object({
    username :z
           .string()
           .trim()
           .min(3 ,{message:"name shhould be min of 3 charactes"})
           .max(100, {message:"name cannot exceed 100 characters"}),
    email:z
           .string()
           .trim()
           .email({message:"invalid email format"}),
           
    password:z
              .string()
              .trim()
              .min(6,{message:"password should be min of 6 characters"})
        
    
})
export  const loginUserSchema = z.object({
    email:z
           .string()
           .trim()
           .email({message:"invalid email format"}),    
       password:z       
              .string()
              .trim()
              .min(6,{message:"password should be min of 6 characters"})
})
