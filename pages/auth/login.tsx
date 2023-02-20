import { useForm, SubmitHandler } from 'react-hook-form';
import { TypeOf, object, string } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/router';

const createSessionSchema = object({
  email: string({
    required_error: 'Email is required',
  }),
  password: string({
    required_error: 'Password is required',
  }),
});

type Inputs = TypeOf<typeof createSessionSchema>;

const LoginPage = () => {
  const router = useRouter();
  const [loginError, setLoginError] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(createSessionSchema),
  });
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/sessions`,
        data,
        { withCredentials: true }
      );

      router.push('/');
    } catch (e: any) {
      setLoginError(e.message);
    }
  };

  // console.log({ errors });
  // console.log(watch('name')); // watch input value by passing the name of it

  return (
    <>
      {loginError && <p>{loginError}</p>}
      {/* "handleSubmit" will validate your inputs before invoking "onSubmit" */}
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* register your input into the hook by invoking the "register" function */}

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

        {/* include validation with required or other standard HTML validation rules */}
        {/* <input {...register('exampleRequired', { required: true })} /> */}
        {/* errors will return when field validation fails  */}
        {/* {errors.exampleRequired && <span>This field is required</span>} */}

        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default LoginPage;
