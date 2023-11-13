import { email, required } from "@vuelidate/validators";
export const passwordRecoverRules = {
  email: { required, email },
  password: { required },
  token: { required },
  password_confirmation: { required },
};
