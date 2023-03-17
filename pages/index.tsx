import useSWR from 'swr';
import styles from '@/styles/Home.module.css';
import fetcher from '../utils/fetcher';
import { GetServerSideProps } from 'next';
import getGoogleOAuthURL from '../utils/getGoogleOAuthURL';

interface User {
  _id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  session: string;
  iat: number;
  exp: number;
}

export default function Home({ fallbackData }: { fallbackData: User }) {
  const { data, error } = useSWR<User | null>(
    `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/me`,
    fetcher,
    { fallbackData }
  );
  console.log({ data });

  if (data) {
    return (
      <div>
        <h1>Welcome, {data.name}</h1>
        <br />
        <a href="">Logout</a>
      </div>
    );
  }
  return (
    <div>
      <a href={getGoogleOAuthURL()}>Login with Google</a>
      <br />
      `` Please login
    </div>
  );
}

// Render index page on the server
export const getServerSideProps: GetServerSideProps = async (context) => {
  const data = await fetcher(
    `${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/api/me`,
    context.req.headers
  );

  return { props: { fallbackData: data } };
};
