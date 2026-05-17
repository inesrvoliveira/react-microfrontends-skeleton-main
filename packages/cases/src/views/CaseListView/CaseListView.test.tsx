import { render, screen } from '@testing-library/react';
import { CaseListView } from './CaseListView';

describe('CaseListView', () => {
  it('renders a Cases heading', () => {
    render(<CaseListView />);

    screen.getByRole('heading', { level: 2, name: 'Cases' });
  });
});
