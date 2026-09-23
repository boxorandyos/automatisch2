import useAutomatischConfig from 'hooks/useAutomatischConfig';

import { LogoImage } from './style';

export default function CustomLogo() {
  const { data, isLoading } = useAutomatischConfig();
  const svgMarkup = data?.data?.logoSvgData;

  if (isLoading || !svgMarkup) {
    return null;
  }

  return (
    <LogoImage
      alt=""
      data-test="custom-logo"
      src={`data:image/svg+xml;utf8,${encodeURIComponent(svgMarkup)}`}
    />
  );
}
