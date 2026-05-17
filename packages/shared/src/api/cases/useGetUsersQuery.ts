import { useQuery } from '@tanstack/react-query';

import fetchTyped from '../../utils/fetchTyped';
import { GetUsersResponse } from '../../mockApi/types';

export const useGetUsersQuery = () =>
  useQuery({
    queryKey: ['users'],
    queryFn: () => fetchTyped<GetUsersResponse>('/api/users', {}),
  });
