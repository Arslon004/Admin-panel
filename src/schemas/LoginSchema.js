import * as yup from 'yup';

const loginSchema = yup.object().shape({
  email: yup.string().email("This field must be valid email!"),
  password: yup.string().min(6,"Password's min length must be 6").max(12,"Password's max length must be 12"),
});

export default loginSchema;