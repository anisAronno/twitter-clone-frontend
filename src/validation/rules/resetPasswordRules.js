import { required } from "@vuelidate/validators";
export const resetPasswordRules = {
  old_password: { required },
  password: { required },
  password_confirmation: { required },
};
