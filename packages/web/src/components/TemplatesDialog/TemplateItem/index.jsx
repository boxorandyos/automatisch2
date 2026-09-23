import * as React from 'react';
import PropTypes from 'prop-types';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { useNavigate } from 'react-router-dom';

import * as URLS from 'config/urls';
import useCreateFlow from 'hooks/useCreateFlow';

export default function TemplateItem({ template }) {
  const navigate = useNavigate();
  const { mutateAsync: createFlow, isPending } = useCreateFlow();

  const handleClick = async () => {
    const response = await createFlow({ templateId: template.id });
    const flowId = response?.data?.id;
    if (flowId) {
      navigate(URLS.FLOW_EDITOR(flowId));
    }
  };

  return (
    <ListItemButton onClick={handleClick} disabled={isPending}>
      <ListItemText primary={template.name} />
    </ListItemButton>
  );
}

TemplateItem.propTypes = {
  template: PropTypes.object.isRequired,
};
