import { email, required } from "@vuelidate/validators";
export const signupRules = {
    name: { required },
    email: { required, email },
    username: { required },  
    password: { required },
    password_confirmation: { required },
};
