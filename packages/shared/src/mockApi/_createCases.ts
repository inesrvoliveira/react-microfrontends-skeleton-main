/* 
  For initial generation of cases mock data
*/

import { faker } from '@faker-js/faker';

import { users } from './users';

const statuses = [
  'CASE_NOT_STARTED',
  'CASE_IN_PROGRESS',
  'CASE_ON_HOLD',
  'CASE_RESOLVED_RISK_DETECTED',
  'CASE_RESOLVED_NO_RISK_DETECTED',
];

const randomStatus = () =>
  statuses[Math.floor(Math.random() * statuses.length)];

const randomUser = () => users[Math.floor(Math.random() * users.length)];

export function createCase() {
  return {
    identifier: faker.string.uuid(),
    assignee_id: randomUser().identifier,
    status: randomStatus(),
    name: faker.company.name(),
  };
}

export const cases = faker.helpers.multiple(createCase, {
  count: 200,
});
