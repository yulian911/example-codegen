import { ProductGetByIdDocument, TypedDocumentString } from '@/gql/graphql';

type GraphQLResponse<T> =
  | { data?: undefined; errors: { message: string }[] }
  | { data: T; errors?: undefined };

export const executeGraphql = async <TResult, TVariables>(
  query: TypedDocumentString<TResult, TVariables>,
  variables: TVariables,
): Promise<TResult> => {
  if (!process.env.GRAPHQL_URL) {
    throw TypeError('GRAPHQL_URL is not defined');
  }
  const res = await fetch(process.env.GRAPHQL_URL, {
    method: 'POST',
    body: JSON.stringify({
      query,
      variables,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const graphQLResponse = (await res.json()) as GraphQLResponse<TResult>;

  if (graphQLResponse.errors) throw new Error('GraphQL error', { cause: graphQLResponse.errors });

  return graphQLResponse.data;
};

export const getProductById = async (id: string) => {
  const product = await executeGraphql(ProductGetByIdDocument, { id });

  return product;
};
