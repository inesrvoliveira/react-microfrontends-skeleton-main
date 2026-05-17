import { useQuery } from '@tanstack/react-query';

import fetchTyped from '../../utils/fetchTyped';

import { Example } from './types';

export const useGetExampleQuery = () => {
  return useQuery({
    queryKey: ['example'],
    queryFn: () => fetchTyped<Example>('/api/example', {}),
  });
};
