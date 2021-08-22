import fetchGraphQL from '@query/fetchGraphQL';
import Head from 'next/head';
import { useQuery } from 'react-query';

const query = `
query searchMyRepository {
  repository(name: "rtv1", owner: "narajaon") {
    createdAt
    description
  }
}
`;

export default function Home() {
  const { isLoading, isError, isSuccess, data } = useQuery('repository', () =>
    fetchGraphQL(query)
  );

  return (
    <div>
      <Head>
        <title>closedsauce | Home page</title>
        <meta name="description" content="closedsauce home page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {(isLoading || isError) && <div>Loading</div>}
      {isSuccess && <div>{data.data.repository.description}</div>}
    </div>
  );
}
