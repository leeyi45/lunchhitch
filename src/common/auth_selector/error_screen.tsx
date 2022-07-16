import React from 'react';

// TODO Styling of this error screen
export default function ErrorScreen({ error }: { error: string }) {
  return (
    <div>
      <h1>:(</h1>
      <p>We&apos;re sorry, but an error has occurred! Please refresh the page and try again</p>
      <p>Error Info: {error}</p>
    </div>
  );
}
