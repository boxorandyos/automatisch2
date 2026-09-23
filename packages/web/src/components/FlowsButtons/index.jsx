import AddIcon from '@mui/icons-material/Add';
import UploadIcon from '@mui/icons-material/Upload';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';

import SplitButton from 'components/SplitButton';

import * as URLS from 'config/urls';
import useAutomatischConfig from 'hooks/useAutomatischConfig';
import useCurrentUserAbility from 'hooks/useCurrentUserAbility';
import useFormatMessage from 'hooks/useFormatMessage';

export default function FlowsButtons() {
  const location = useLocation();
  const formatMessage = useFormatMessage();
  const currentUserAbility = useCurrentUserAbility();
  const theme = useTheme();
  const matchSmallScreens = useMediaQuery(theme.breakpoints.down('md'));
  const canCreateFlow = currentUserAbility.can('manage', 'Flow');
  const { data: configData } = useAutomatischConfig();
  const enableTemplates = configData?.data?.enableTemplates;

  const createFlowButtonData = {
    label: formatMessage('flows.createFlow'),
    key: 'createFlow',
    'data-test': 'create-flow-button',
    to: URLS.CREATE_FLOW,
    startIcon: <AddIcon />,
  };

  const createFromTemplateButtonData = {
    label: formatMessage('flows.createFlowFromTemplate'),
    key: 'createFlowFromTemplate',
    'data-test': 'create-flow-from-template-button',
    to: URLS.VIEW_TEMPLATES,
    startIcon: <LibraryBooksIcon />,
  };

  const importFlowButtonData = {
    label: formatMessage('flows.importFlow'),
    key: 'importFlow',
    'data-test': 'import-flow-button',
    to: URLS.IMPORT_FLOW,
  };

  if (matchSmallScreens) {
    const connectionOptions = [
      createFlowButtonData,
      ...(enableTemplates ? [createFromTemplateButtonData] : []),
      importFlowButtonData,
    ];

    return (
      <>
        <SplitButton disabled={!canCreateFlow} options={connectionOptions} />
      </>
    );
  }

  return (
    <>
      <Button
        type="submit"
        variant="outlined"
        color="info"
        size="large"
        component={Link}
        disabled={!canCreateFlow}
        startIcon={<UploadIcon />}
        to={{ pathname: URLS.IMPORT_FLOW, search: location.search }}
        data-test="import-flow-button"
      >
        {formatMessage('flows.importFlow')}
      </Button>

      {enableTemplates && (
        <Button
          type="submit"
          variant="outlined"
          color="info"
          size="large"
          component={Link}
          disabled={!canCreateFlow}
          startIcon={<LibraryBooksIcon />}
          to={URLS.VIEW_TEMPLATES}
          data-test="create-flow-from-template-button"
        >
          {formatMessage('flows.createFlowFromTemplate')}
        </Button>
      )}

      <Button
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        component={Link}
        disabled={!canCreateFlow}
        startIcon={<AddIcon />}
        to={URLS.CREATE_FLOW}
        data-test="create-flow-button"
      >
        {formatMessage('flows.createFlow')}
      </Button>
    </>
  );
}
