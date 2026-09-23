import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import GroupIcon from '@mui/icons-material/Group';
import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import * as React from 'react';

import AppBar from 'components/AppBar';
import Drawer from 'components/Drawer';
import * as URLS from 'config/urls';
import useFormatMessage from 'hooks/useFormatMessage';
import useIsCurrentUserAdmin from 'hooks/useIsCurrentUserAdmin';

import Footer from './Footer';

function createDrawerLinks({ isCurrentUserAdmin }) {
  const items = [
    isCurrentUserAdmin
      ? {
          Icon: GroupIcon,
          primary: 'adminSettingsDrawer.users',
          to: URLS.USERS,
          dataTest: 'users-drawer-link',
        }
      : null,
  ].filter(Boolean);

  return items;
}

function AdminSettingsLayout() {
  const theme = useTheme();
  const formatMessage = useFormatMessage();
  const isCurrentUserAdmin = useIsCurrentUserAdmin();
  const matchSmallScreens = useMediaQuery(theme.breakpoints.down('lg'));
  const [isDrawerOpen, setDrawerOpen] = React.useState(!matchSmallScreens);
  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  const drawerLinks = createDrawerLinks({
    isCurrentUserAdmin: isCurrentUserAdmin,
  });

  const drawerBottomLinks = [
    {
      Icon: ArrowBackIosNewIcon,
      primary: formatMessage('adminSettingsDrawer.goBack'),
      to: '/',
      dataTest: 'go-back-drawer-link',
    },
  ];

  return (
    <>
      <AppBar
        drawerOpen={isDrawerOpen}
        onDrawerOpen={openDrawer}
        onDrawerClose={closeDrawer}
      />

      <Box sx={{ display: 'flex', flex: 1 }}>
        <Drawer
          links={drawerLinks}
          bottomLinks={drawerBottomLinks}
          open={isDrawerOpen}
          onOpen={openDrawer}
          onClose={closeDrawer}
        />

        <Stack sx={{ flex: 1 }}>
          <Toolbar />
          <Outlet />
          <Footer />
        </Stack>
      </Box>
    </>
  );
}

export default AdminSettingsLayout;
