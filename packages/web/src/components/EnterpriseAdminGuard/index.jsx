import PropTypes from 'prop-types';

import AdminGuard from 'components/AdminGuard';

/**
 * Formerly gated on isEnterprise + admin. isEnterprise is always true in CE
 * now, so this is an AdminGuard alias.
 */
export default function EnterpriseAdminGuard({ children }) {
  return <AdminGuard>{children}</AdminGuard>;
}

EnterpriseAdminGuard.propTypes = {
  children: PropTypes.node.isRequired,
};
