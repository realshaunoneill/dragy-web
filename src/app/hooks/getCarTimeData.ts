import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { CarTime } from '@/types/car-data';

interface Props {
    carId?: string;
}

async function getCarTimeData(carId?: string): Promise<CarTime[]> {
  if (!carId) {
    return [];
  }

  const response = await fetch(`/api/details?carId=${carId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch car time data');
  }
  return response.json();
}

const useGetCarTimeData = ({ carId }: Props): UseQueryResult<CarTime[]> => {
  return useQuery({
    queryKey: ['CAR_TIME_DATA', carId],
    queryFn: () => getCarTimeData(carId),
  });
};

export default useGetCarTimeData;
