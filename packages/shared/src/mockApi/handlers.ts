import { http, HttpResponse, StrictRequest, DefaultBodyType } from 'msw';
import example from './example.json';
import { users } from './users';
import { cases } from './cases';

import { GetCasesResponse, GetUsersResponse } from './types';

export const casesHandler = ({
  request,
}: {
  request: StrictRequest<DefaultBodyType>;
}) => {
  const url = new URL(request.url);

  const page_size = url.searchParams.get('page_size');
  const page_number = url.searchParams.get('page_number');

  const page = parseInt(page_number as string, 10) || 1;
  const size = parseInt(page_size as string, 10) || 25;

  const start = (page - 1) * size;

  if (start > cases.length - 1) {
    return HttpResponse.json({
      cases: [],
      total_count: 0,
      first: '',
      next: '',
      prev: '',
      self: '',
    });
  }

  const end = start + size;

  const casesArray = cases.slice(start, end);

  const hasNext = end < cases.length;

  return HttpResponse.json({
    cases: casesArray,
    total_count: casesArray.length,
    first: '/api/cases?page_number=1',
    next: hasNext ? `/api/cases?page_number=${page + 1}` : '',
    prev: page > 1 ? `/api/cases?page_number=${page - 1}` : '',
    self: `/api/cases?page_number=${page}`,
  } as GetCasesResponse);
};

export const apiHandlers = [
  http.get('/api/example', () => {
    return HttpResponse.json(example);
  }),

  http.get('/api/users', () => {
    return HttpResponse.json(users as GetUsersResponse);
  }),

  http.get('/api/cases', casesHandler),
];
