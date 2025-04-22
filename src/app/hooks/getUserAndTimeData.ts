import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { CarDetails, CarTime, UserDetails } from '@/types/car-data';

interface Props {
    userId?: string;
    carId?: string;
}

async function getUserAndTimeData(userId?: string, carId?: string): Promise<{ userData: UserDetails[], timeData: CarTime[], graphData: CarDetails }> {
  if (!userId) {
    return { userData: [], timeData: [], graphData: {} as CarDetails };
  }

  const response = await fetch(`/api/user?userId=${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user data', { cause: response.status });
  }
  const userData = await response.json() as UserDetails[];

  const timeResponse = await fetch(`/api/times?carId=${carId}`);
  if (!timeResponse.ok) {
    throw new Error('Failed to fetch car time data', { cause: timeResponse.status });
  }
  const timeData = await timeResponse.json() as CarTime[];

  const graphResponse = await fetch(`/api/details?id=${carId}`);
  if (!graphResponse.ok) {
    throw new Error('Failed to fetch car details data', { cause: graphResponse.status });
  }
  const graphData = await graphResponse.json() as CarDetails;

  console.log('HOOK DATA', { userData, timeData, graphData });
  
  return { userData, timeData, graphData };
}

const useGetUserAndTimeData = ({ userId, carId }: Props): UseQueryResult<{ userData: UserDetails[], timeData: CarTime[], graphData: CarDetails }> => {
  return useQuery({
    queryKey: ['USER_AND_TIME_DATA', userId, carId],
    queryFn: () => getUserAndTimeData(userId, carId),
    enabled: !!userId && !!carId,
    retry: 6,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });
};

export default useGetUserAndTimeData;
