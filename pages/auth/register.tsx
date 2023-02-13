import { useForm, SubmitHandler } from 'react-hook-form';
import { object, string } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useState } from 'react';

const createUserSchema = object({
  name: string({
    required_error: 'Name is required',
  }).min(1, { message: 'Name is required' }),
  password: string({
    required_error: 'Password is required',
  }).min(6, 'Password should be a minimum of 6 characters'),
  passwordConfirmation: string({
    required_error: 'Password is required',
  }).min(6, 'Password should be a minimum of 6 characters'),
  email: string({
    required_error: 'Email is required',
  }).email('Not a valid email'),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: 'Passwords do not match',
  path: ['passwordConfirmation'],
});

type Inputs = {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
};

const RegisterPage = () => {
  const [registerError, setRegisterError] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(createUserSchema),
  });
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/users`,
        data
      );
    } catch (e: any) {
      setRegisterError(e.message);
    }
  };

  // console.log({ errors });
  // console.log(watch('name')); // watch input value by passing the name of it

  return (
    <>
      {registerError && <p>{registerError}</p>}
      {/* "handleSubmit" will validate your inputs before invoking "onSubmit" */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* register your input into the hook by invoking the "register" function */}
        <div className="form-element">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            placeholder="Jane Doe"
            {...register('name')}
          />
          {errors.name && <p>{errors.name?.message}</p>}
        </div>
        <div className="form-element">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="jane.doe@example.com"
            {...register('email')}
          />
          {errors.email && <p>{errors.email?.message}</p>}{' '}
        </div>
        <div className="form-element">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="******"
            {...register('password')}
          />
          {errors.password && <p>{errors.password?.message}</p>}
        </div>
        <div className="form-element">
          <label htmlFor="passwordConfirmation">Password Confirmation</label>
          <input
            id="passwordConfirmation"
            type="password"
            placeholder="******"
            {...register('passwordConfirmation')}
          />
          {errors.passwordConfirmation && (
            <p>{errors.passwordConfirmation?.message}</p>
          )}
        </div>

        {/* include validation with required or other standard HTML validation rules */}
        {/* <input {...register('exampleRequired', { required: true })} /> */}
        {/* errors will return when field validation fails  */}
        {/* {errors.exampleRequired && <span>This field is required</span>} */}

        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default RegisterPage;
