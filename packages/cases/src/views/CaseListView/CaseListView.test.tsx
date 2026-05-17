import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { CaseListView } from './CaseListView';

// ---- mock data ------------------------------------------------------------
const mockUsers = [
  { identifier: 'user-1', name: 'Alice Active', active: true },
  { identifier: 'user-2', name: 'Bob Inactive', active: false },
];

const mockCases = [
  {
    identifier: 'case-1',
    name: 'Acme Corp',
    status: 'CASE_IN_PROGRESS',
    assignee_id: 'user-1',
  },
  {
    identifier: 'case-2',
    name: 'Beta Ltd',
    status: 'CASE_ON_HOLD',
    assignee_id: 'user-2',
  },
  {
    identifier: 'case-3',
    name: 'Gamma Inc',
    status: 'CASE_IN_PROGRESS',
    assignee_id: 'user-2',
  },
];

const server = setupServer(
  http.get('/api/cases', () =>
    HttpResponse.json({
      cases: mockCases,
      total_count: mockCases.length,
      first: '',
      next: '',
      prev: '',
      self: '',
    }),
  ),
  http.get('/api/users', () => HttpResponse.json(mockUsers)),
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// ---- helper ---------------------------------------------------------------
const renderComponent = () => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={qc}>
      <MemoryRouter>
        <CaseListView />
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

/** Opens a custom dropdown and clicks one of its options by visible text */
const selectOption = async (comboboxName: RegExp, optionText: string) => {
  const trigger = screen.getByRole('combobox', { name: comboboxName });
  await userEvent.click(trigger);
  const listbox = screen.getByRole('listbox', { name: comboboxName });
  await userEvent.click(within(listbox).getByText(optionText));
};

// ---- tests ----------------------------------------------------------------
describe('CaseListView', () => {
  it('renders a Cases heading', () => {
    renderComponent();
    screen.getByRole('heading', { name: 'Cases' });
  });

  it('shows all cases after loading', async () => {
    renderComponent();
    expect(await screen.findByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('Beta Ltd')).toBeInTheDocument();
    expect(screen.getByText('Gamma Inc')).toBeInTheDocument();
  });

  it('shows an Inactive badge for each case assigned to an inactive user', async () => {
    renderComponent();
    await screen.findByText('Acme Corp');
    expect(screen.getAllByText('Inactive')).toHaveLength(2);
  });

  it('filters cases by assignee', async () => {
    renderComponent();
    await screen.findByText('Acme Corp');
    await selectOption(/assignee/i, 'Alice Active');
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.queryByText('Beta Ltd')).not.toBeInTheDocument();
  });

  it('filters cases by status', async () => {
    renderComponent();
    await screen.findByText('Acme Corp');
    await selectOption(/status/i, 'On Hold');
    expect(screen.getByText('Beta Ltd')).toBeInTheDocument();
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument();
    expect(screen.queryByText('Gamma Inc')).not.toBeInTheDocument();
  });

  it('combines assignee and status filters', async () => {
    renderComponent();
    await screen.findByText('Acme Corp');
    await selectOption(/assignee/i, 'Bob Inactive');
    await selectOption(/status/i, 'In Progress');
    expect(screen.getByText('Gamma Inc')).toBeInTheDocument();
    expect(screen.queryByText('Beta Ltd')).not.toBeInTheDocument();
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument();
  });

  it('clear filters button is disabled when no filters are active', async () => {
    renderComponent();
    await screen.findByText('Acme Corp');
    expect(
      screen.getByRole('button', { name: /clear filters/i }),
    ).toBeDisabled();
  });

  it('clear filters button becomes enabled when a filter is applied', async () => {
    renderComponent();
    await screen.findByText('Acme Corp');
    await selectOption(/assignee/i, 'Alice Active');
    expect(
      screen.getByRole('button', { name: /clear filters/i }),
    ).not.toBeDisabled();
  });

  it('clears all filters when the clear button is clicked', async () => {
    renderComponent();
    await screen.findByText('Acme Corp');
    await selectOption(/assignee/i, 'Alice Active');
    await userEvent.click(
      screen.getByRole('button', { name: /clear filters/i }),
    );
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('Beta Ltd')).toBeInTheDocument();
    expect(screen.getByText('Gamma Inc')).toBeInTheDocument();
  });

  it('shows the assignee name without "(inactive)" in the dropdown', async () => {
    renderComponent();
    await screen.findByText('Acme Corp');
    const trigger = screen.getByRole('combobox', { name: /assignee/i });
    await userEvent.click(trigger);
    const listbox = screen.getByRole('listbox', { name: /assignee/i });
    expect(within(listbox).getByText('Bob Inactive')).toBeInTheDocument();
    expect(
      within(listbox).queryByText('Bob Inactive (inactive)'),
    ).not.toBeInTheDocument();
  });

  it('inactive-only toggle shows only cases with inactive assignees', async () => {
    renderComponent();
    await screen.findByText('Acme Corp');
    await userEvent.click(
      screen.getByRole('switch', { name: /inactive assignees only/i }),
    );
    // Beta Ltd and Gamma Inc are assigned to user-2 (inactive); Acme Corp is user-1 (active)
    expect(screen.getByText('Beta Ltd')).toBeInTheDocument();
    expect(screen.getByText('Gamma Inc')).toBeInTheDocument();
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument();
  });

  it('inactive-only toggle combines with other filters', async () => {
    renderComponent();
    await screen.findByText('Acme Corp');
    await userEvent.click(
      screen.getByRole('switch', { name: /inactive assignees only/i }),
    );
    await selectOption(/status/i, 'On Hold');
    expect(screen.getByText('Beta Ltd')).toBeInTheDocument();
    expect(screen.queryByText('Gamma Inc')).not.toBeInTheDocument();
  });

  it('inactive-only toggle is included in clear filters', async () => {
    renderComponent();
    await screen.findByText('Acme Corp');
    await userEvent.click(
      screen.getByRole('switch', { name: /inactive assignees only/i }),
    );
    expect(screen.queryByText('Acme Corp')).not.toBeInTheDocument();
    await userEvent.click(
      screen.getByRole('button', { name: /clear filters/i }),
    );
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
  });

  it('inactive-only toggle enables the clear filters button', async () => {
    renderComponent();
    await screen.findByText('Acme Corp');
    expect(
      screen.getByRole('button', { name: /clear filters/i }),
    ).toBeDisabled();
    await userEvent.click(
      screen.getByRole('switch', { name: /inactive assignees only/i }),
    );
    expect(
      screen.getByRole('button', { name: /clear filters/i }),
    ).not.toBeDisabled();
  });

  it('shows total case count', async () => {
    renderComponent();
    await screen.findByText('Acme Corp');
    expect(screen.getByText(/3 cases/i)).toBeInTheDocument();
  });

  it('shows filtered vs total count when filters are active', async () => {
    renderComponent();
    await screen.findByText('Acme Corp');
    await selectOption(/status/i, 'On Hold');
    expect(screen.getByText(/1 of 3/i)).toBeInTheDocument();
  });
});
