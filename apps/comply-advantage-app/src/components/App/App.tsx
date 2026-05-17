import { Box } from 'theme-ui';
import { Outlet } from 'react-router-dom';
import { Nav } from '../Nav/Nav';

import { ExampleApi } from 'shared';

function App() {
  /* Example data query - can delete if you wish */
  const { data } = ExampleApi.useGetExampleQuery();
  console.log('Data retrieved from example API with react query:', data);

  return (
    <>
      <Nav />
      <Box sx={{ p: 'spacing-md' }}>
        <Outlet />
      </Box>
    </>
  );
}

export default App;
