import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { CarDetails, CarTime, UserDetails } from '@/types/car-data';

interface Props {
    userId?: string;
    carId?: string;
}

async function getUserAndTimeData(userId?: string, carId?: string): Promise<{ userData: UserDetails[], timeData: CarTime[], graphData: CarDetails[] }> {
  if (!userId) {
    return { userData: [], timeData: [], graphData: [] };
  }

  const response = await fetch(`/api/user?userId=${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user data');
  }
  const userData = await response.json() as UserDetails[];

  const timeResponse = await fetch(`/api/times?carId=${carId}`);
  if (!timeResponse.ok) {
    throw new Error('Failed to fetch car time data');
  }
  const timeData = await timeResponse.json() as CarTime[];

  const graphResponse = await fetch(`/api/details?id=${carId}`);
  if (!graphResponse.ok) {
    throw new Error('Failed to fetch car time data');
  }
  const graphData = await graphResponse.json() as CarDetails[];

  console.log('HOOK DATA', { userData, timeData, graphData });
  
  return { userData, timeData, graphData };
}

const useGetUserAndTimeData = ({ userId, carId }: Props): UseQueryResult<{ userData: UserDetails[], timeData: CarTime[], graphData: CarDetails[] }> => {
  return useQuery({
    queryKey: ['USER_AND_TIME_DATA', userId, carId],
    queryFn: () => getUserAndTimeData(userId, carId),
  });
};

export default useGetUserAndTimeData;
