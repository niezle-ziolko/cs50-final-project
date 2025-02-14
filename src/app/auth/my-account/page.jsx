'use client';
import ClientPanel from 'components/panel';
import EditForm from 'components/forms/edit';

import 'styles/css/components/forms.css';
import 'styles/css/components/panel.css';

export default function MyAccount() {
  const title = 'Liked books';

  return (
    <div className='page'>
      <ClientPanel title={title} />
      <EditForm />
    </div>
  );
};