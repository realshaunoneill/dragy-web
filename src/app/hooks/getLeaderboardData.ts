import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { Country } from '../../constants/countries';
import { CarList } from '@/types/car-data';
import { Metric, METRICS } from '@/src/constants/metrics';
interface Props {
  country: Country;
  metric: Metric;
}

async function getLeaderboardData(country: string, metric: Metric): Promise<CarList[]> {
  const response = await fetch(`/api/leaderboard?country=${country}&metric=${METRICS[metric].value}`);
  if (!response.ok) {
    throw new Error('Failed to fetch leaderboard data');
  }
  return response.json();
}

const useGetLeaderboardData = ({ country, metric }: Props): UseQueryResult<CarList[]> => {
  return useQuery({
    queryKey: ['LEADERBOARD_DATA', country.id, metric],
    queryFn: () => getLeaderboardData(country.id.toString(), metric),
  });
};

export default useGetLeaderboardData;
