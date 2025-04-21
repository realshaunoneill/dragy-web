import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { CarDetails, UserDetails } from '@/types/car-data';

interface Props {
    userId?: string;
    carId?: string;
}

async function getUserAndTimeData(userId?: string, carId?: string): Promise<{ userData: UserDetails[], timeData: CarDetails[] }> {
  if (!userId) {
    return { userData: [], timeData: [] };
  }

  const response = await fetch(`/api/user?userId=${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }
  const userData = await response.json() as UserDetails[];

  console.log('userData', userData);

  const timeResponse = await fetch(`/api/details?id=${carId}`);
  if (!timeResponse.ok) {
    throw new Error('Failed to fetch car time data');
  }
  const timeData = await timeResponse.json() as CarDetails[];

  console.log('HOOK DATA', { userData, timeData });
  
  return { userData, timeData };
}

const useGetUserAndTimeData = ({ userId, carId }: Props): UseQueryResult<{ userData: UserDetails[], timeData: CarDetails[] }> => {
  return useQuery({
    queryKey: ['USER_AND_TIME_DATA', userId, carId],
    queryFn: () => getUserAndTimeData(userId, carId),
  });
};

export default useGetUserAndTimeData;
