import { required } from "@vuelidate/validators";
export const signupRules = {
  token: { required },
  password: { required },
  password_confirmation: { required },
};
