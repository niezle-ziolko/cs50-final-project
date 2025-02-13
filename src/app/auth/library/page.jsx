'use client';
import ClientPanel from 'components/panel';
import EditForm from 'components/forms/edit';

import 'styles/css/theme/forms.css';

export default function MyAccount() {
  const title = 'Library';

  return (
    <div className='page'>
      <ClientPanel title={title} />
      <EditForm />
    </div>
  );
};