import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { CarTime, UserDetails } from '@/types/car-data';

interface Props {
    userId?: string;
    carId?: string;
}

async function getUserAndTimeData(userId?: string, carId?: string) {
  if (!userId) {
    return { userData: [], timeData: [] };
  }

  const response = await fetch(`/api/user?userId=${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }
  const userData = await response.json();

  console.log('userData', userData);

  const timeResponse = await fetch(`/api/times?carId=${carId}`);
  if (!timeResponse.ok) {
    throw new Error('Failed to fetch car time data');
  }
  const timeData = await timeResponse.json();

  console.log('HOOK DATA', { userData: userData.data, timeData });
  
  return { userData: userData.data, timeData };
}

const useGetUserAndTimeData = ({ userId, carId }: Props): UseQueryResult<{ userData: UserDetails[], timeData: CarTime[] }> => {
  return useQuery({
    queryKey: ['USER_AND_TIME_DATA', userId, carId],
    queryFn: () => getUserAndTimeData(userId, carId),
  });
};

export default useGetUserAndTimeData;
