import { email, required } from "@vuelidate/validators";
export const customerRules = {
  name: { required },
  email: { required, email },
  address: { required },
  phone: { required },  
  token: { required },
  address: { required },
  country: { required },  
};
