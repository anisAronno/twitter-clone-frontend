import { required } from "@vuelidate/validators";
export const passwordUpdateRules = {
  old_password: { required },
  password: { required },
  password_confirmation: { required },
};
