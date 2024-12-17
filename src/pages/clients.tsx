import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ClientView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Clients- ${CONFIG.appName}`}</title>
      </Helmet>

      <ClientView />
    </>
  );
}
