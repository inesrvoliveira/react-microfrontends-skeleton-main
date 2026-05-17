import { render, screen } from '@testing-library/react';
import { Nav } from './Nav';

import { RouterProvider, createMemoryRouter } from 'react-router-dom';

const routes = [
  {
    path: '*',
    element: <Nav />,
  },
];

const router = createMemoryRouter(routes, {
  initialEntries: ['/'],
  initialIndex: 1,
});

describe('Nav', () => {
  it('provides link to Home', () => {
    render(<RouterProvider router={router} />);

    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute(
      'href',
      '/',
    );
  });

  it('provides link to Cases', () => {
    render(<RouterProvider router={router} />);

    expect(screen.getByRole('link', { name: 'Cases' })).toHaveAttribute(
      'href',
      '/cases',
    );
  });
});
