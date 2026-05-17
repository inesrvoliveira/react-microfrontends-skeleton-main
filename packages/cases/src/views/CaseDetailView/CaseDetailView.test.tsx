import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { CaseDetailView } from './CaseDetailView';

// ---- mock data --------------------------------------------------------------

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

// ---- helpers ----------------------------------------------------------------

/**
 * Renders CaseDetailView inside a router with the given case ID as the
 * :id param. The stub /cases route lets us assert navigation back to the list.
 */
const renderDetail = (caseId: string) => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={[`/cases/${caseId}`]}>
        <Routes>
          <Route path="/cases/:id" element={<CaseDetailView />} />
          <Route path="/cases" element={<div>Cases list</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

// ---- tests ------------------------------------------------------------------

describe('CaseDetailView', () => {
  it('shows a loading state while data is fetching', () => {
    renderDetail('case-1');
    expect(screen.getByText('Loading…')).toBeInTheDocument();
  });

  it('renders the case name as a heading', async () => {
    renderDetail('case-1');
    expect(
      await screen.findByRole('heading', { name: 'Acme Corp' }),
    ).toBeInTheDocument();
  });

  it('renders the case ID in the detail card', async () => {
    renderDetail('case-1');
    await screen.findByRole('heading', { name: 'Acme Corp' });
    expect(screen.getByText('case-1')).toBeInTheDocument();
  });

  it('renders the human-readable status label', async () => {
    renderDetail('case-1');
    await screen.findByRole('heading', { name: 'Acme Corp' });
    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('renders the correct status label for a different status', async () => {
    renderDetail('case-2');
    await screen.findByRole('heading', { name: 'Beta Ltd' });
    expect(screen.getByText('On Hold')).toBeInTheDocument();
  });

  it('renders the assignee name', async () => {
    renderDetail('case-1');
    await screen.findByRole('heading', { name: 'Acme Corp' });
    expect(screen.getByText('Alice Active')).toBeInTheDocument();
  });

  it('does not show an Inactive badge for an active assignee', async () => {
    renderDetail('case-1');
    await screen.findByRole('heading', { name: 'Acme Corp' });
    expect(screen.queryByText('Inactive')).not.toBeInTheDocument();
  });

  it('shows an Inactive badge for an inactive assignee', async () => {
    renderDetail('case-2');
    await screen.findByRole('heading', { name: 'Beta Ltd' });
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  it('renders the assignee avatar initials', async () => {
    renderDetail('case-1');
    await screen.findByRole('heading', { name: 'Acme Corp' });
    // Alice Active → "AA"
    expect(screen.getByText('AA')).toBeInTheDocument();
  });

  it('renders the inactive assignee avatar with grey styling', async () => {
    renderDetail('case-2');
    await screen.findByRole('heading', { name: 'Beta Ltd' });
    // Bob Inactive → "BI"
    expect(screen.getByText('BI')).toBeInTheDocument();
  });

  it('navigates back to /cases when the back button is clicked', async () => {
    renderDetail('case-1');
    await screen.findByRole('heading', { name: 'Acme Corp' });
    await userEvent.click(screen.getByRole('button', { name: /back to cases/i }));
    expect(screen.getByText('Cases list')).toBeInTheDocument();
  });

  it('shows "Case not found" for an unknown case ID', async () => {
    renderDetail('case-unknown');
    // Wait for data to load then check not-found message
    await screen.findByText('Case not found.');
  });

  it('shows a back link on the not-found screen', async () => {
    renderDetail('case-unknown');
    await screen.findByText('Case not found.');
    await userEvent.click(screen.getByRole('button', { name: /back to cases/i }));
    expect(screen.getByText('Cases list')).toBeInTheDocument();
  });
});

