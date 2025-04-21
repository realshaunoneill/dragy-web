import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { UserDetails } from '@/types/car-data';

interface Props {
    userId: string;
}

async function getUserData(userId: string) {
  const response = await fetch(`/api/user?id=${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }
  return response.json();
}

const useGetUserData = ({ userId }: Props): UseQueryResult<UserDetails[]> => {
  return useQuery({
    queryKey: ['USER_DATA', userId],
    queryFn: () => getUserData(userId),
  });
};

export default useGetUserData;
