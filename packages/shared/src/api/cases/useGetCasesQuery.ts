import { useQuery } from '@tanstack/react-query';

import fetchTyped from '../../utils/fetchTyped';
import { GetCasesResponse } from '../../mockApi/types';

export const useGetCasesQuery = () =>
  useQuery({
    queryKey: ['cases'],
    queryFn: () => fetchTyped<GetCasesResponse>('/api/cases?page_size=200', {}),
  });
