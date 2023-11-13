function parseError(error) {  
    if (error.value?.$error) {
      let frontendEror = error.value?.$errors;
      return frontendEror.reduce(
        (a, v) => ({ ...a, [v["$propertyPath"]]: [v["$message"]] }),
        {}
      );
    } 
    return error?.response?.data?.errors;
  }

  
export default parseError;
  