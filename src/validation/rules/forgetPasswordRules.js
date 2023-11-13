import { email, required } from "@vuelidate/validators";
export const forgetPasswordRules = {
  email: { required, email }, 
};
