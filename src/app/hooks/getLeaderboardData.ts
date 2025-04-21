import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { Country } from '../../constants/countries';
import { CarList } from '@/types/car-data';

interface Props {
  country: Country;
  group: string;
}

async function getLeaderboardData(country: string, group: string): Promise<CarList[]> {
  const response = await fetch(`/api/leaderboard?country=${country}&group=${group}`);
  if (!response.ok) {
    throw new Error('Failed to fetch leaderboard data');
  }
  return response.json();
}

const useGetLeaderboardData = ({ country, group }: Props): UseQueryResult<CarList[]> => {
  return useQuery({
    queryKey: ['LEADERBOARD_DATA', country.id, group],
    queryFn: () => getLeaderboardData(country.id.toString(), group),
  });
};

export default useGetLeaderboardData;
