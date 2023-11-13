import { email, required } from "@vuelidate/validators";
export const loginRules = {
  email: { required, email },
  password: { required },
};
