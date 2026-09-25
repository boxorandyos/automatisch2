import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import * as URLS from 'config/urls';
import useCreateAgent from 'hooks/useCreateAgent';
import useFormatMessage from 'hooks/useFormatMessage';

export default function AgentsButtons() {
  const formatMessage = useFormatMessage();
  const navigate = useNavigate();
  const { mutateAsync: createAgent, isPending } = useCreateAgent();

  const handleCreate = async () => {
    const response = await createAgent({ name: '' });
    const agentId = response?.data?.id;
    if (agentId) {
      navigate(URLS.AGENT(agentId));
    }
  };

  return (
    <Button
      variant="contained"
      color="primary"
      size="large"
      startIcon={<AddIcon />}
      onClick={handleCreate}
      disabled={isPending}
      data-test="create-agent-button"
    >
      {formatMessage('agentsPage.createAgent')}
    </Button>
  );
}
