import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { UserDetails } from '@/types/car-data';

interface Props {
    id: string;
}

async function getUserData(id: string) {
  const response = await fetch(`/api/user?id=${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }
  return response.json();
}

const useGetUserData = ({ id }: Props): UseQueryResult<UserDetails[]> => {
  return useQuery({
    queryKey: ['USER_DATA', id],
    queryFn: () => getUserData(id),
  });
};

export default useGetUserData;
