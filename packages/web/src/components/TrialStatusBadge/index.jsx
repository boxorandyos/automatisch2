import * as React from 'react';
import Chip from '@mui/material/Chip';

import useCurrentUser from 'hooks/useCurrentUser';
import useUserTrial from 'hooks/useUserTrial';

export default function TrialStatusBadge() {
  const { data: currentUserData } = useCurrentUser();
  const userId = currentUserData?.data?.id;
  const { data } = useUserTrial(userId);
  const trial = data?.data;

  if (!trial?.inTrial) {
    return null;
  }

  return (
    <Chip
      size="small"
      color="warning"
      label={`Trial: ${trial.expireAt ? 'active' : 'active'}`}
      sx={{ ml: 1 }}
    />
  );
}
