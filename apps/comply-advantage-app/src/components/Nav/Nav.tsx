import { Link } from 'react-router-dom';
import { Button, Flex, Image, Box } from 'theme-ui';

import logo from '../../assets/comply_logo.svg';

export const Nav = () => (
  <Box
    sx={{
      p: 'spacing-xs',
      borderBottomWidth: 'border-width-md',
      borderBottomColor: 'neutral400',
      borderBottomStyle: 'solid',
    }}
  >
    <Flex
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        gap: 'spacing-md',
        position: 'relative',
      }}
    >
      <Box sx={{ position: 'absolute', top: 0, left: 0 }}>
        <Image src={logo} sx={{ height: '40px' }} />
      </Box>

      <Link to={'/'}>
        <Button>Home</Button>
      </Link>
      <Link to={'/cases'}>
        <Button>Cases</Button>
      </Link>
    </Flex>
  </Box>
);
