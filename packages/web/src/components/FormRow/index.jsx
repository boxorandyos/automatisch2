import * as React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import CardActionArea from '@mui/material/CardActionArea';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { DateTime } from 'luxon';

import FormContextMenu from 'components/FormContextMenu';
import useFormatMessage from 'hooks/useFormatMessage';
import * as URLS from 'config/urls';

export default function FormRow({ form }) {
  const formatMessage = useFormatMessage();
  const contextButtonRef = React.useRef(null);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const createdAt = DateTime.fromMillis(parseInt(form.createdAt, 10));
  const relativeCreatedAt = createdAt.isValid ? createdAt.toRelative() : '';

  return (
    <>
      <Card sx={{ mb: 1 }} data-test="form-row">
        <CardActionArea component={Link} to={URLS.EDIT_FORM(form.id)}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              px: 2,
              py: 1.5,
            }}
          >
            <Stack spacing={0.5} sx={{ minWidth: 0 }}>
              <Typography variant="h6" noWrap>
                {form.name}
              </Typography>
              <Typography variant="caption">
                {formatMessage('formRow.createdAt', {
                  datetime: relativeCreatedAt,
                })}
              </Typography>
            </Stack>

            <IconButton
              size="large"
              color="inherit"
              aria-label="open context menu"
              ref={contextButtonRef}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setAnchorEl(contextButtonRef.current);
              }}
            >
              <MoreHorizIcon />
            </IconButton>
          </Box>
        </CardActionArea>
      </Card>

      {anchorEl && (
        <FormContextMenu
          formId={form.id}
          onClose={() => setAnchorEl(null)}
          anchorEl={anchorEl}
        />
      )}
    </>
  );
}

FormRow.propTypes = {
  form: PropTypes.object.isRequired,
};
