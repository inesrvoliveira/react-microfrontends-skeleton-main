export interface Case {
  identifier: string;
  assignee_id: string;
  status: string;
  name: string;
}

export type GetCasesResponse = {
  cases: Case[];
  total_count: number;
  first: string;
  next: string;
  prev: string;
  self: string;
};

export interface User {
  identifier: string;
  name: string;
  active: boolean;
}

export type GetUsersResponse = User[];
