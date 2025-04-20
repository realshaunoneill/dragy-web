import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { CarTime } from '@/types/car-data';

interface Props {
    id: string;
}

async function getCarTimeData(id: string) {
  const response = await fetch(`/api/times?id=${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch car time data');
  }
  return response.json();
}

const useGetCarTimeData = ({ id }: Props): UseQueryResult<CarTime[]> => {
  return useQuery({
    queryKey: ['CAR_TIME_DATA', id],
    queryFn: () => getCarTimeData(id),
  });
};

export default useGetCarTimeData;
