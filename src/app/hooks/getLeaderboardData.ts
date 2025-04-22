import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { Country } from '../../constants/countries';
import { CarList } from '@/types/car-data';
import { Metric, METRICS } from '@/src/constants/metrics';
interface Props {
  country: Country;
  group: string;
  metric: Metric;
}

async function getLeaderboardData(country: string, group: string, metric: Metric): Promise<CarList[]> {
  const response = await fetch(`/api/leaderboard?country=${country}&group=${group}&metric=${METRICS[metric].value}`);
  if (!response.ok) {
    throw new Error('Failed to fetch leaderboard data');
  }
  return response.json();
}

const useGetLeaderboardData = ({ country, group, metric }: Props): UseQueryResult<CarList[]> => {
  return useQuery({
    queryKey: ['LEADERBOARD_DATA', country.id, group, metric],
    queryFn: () => getLeaderboardData(country.id.toString(), group, metric),
  });
};

export default useGetLeaderboardData;
