import React from 'react';
import './App.css';
import '@aws-amplify/ui-react/styles.css';

import Amplify from 'aws-amplify';
import aws_exports from './aws-exports';
import { FileUploader, Authenticator } from '@aws-amplify/ui-react';
Amplify.configure(aws_exports);
function App() {
  const onSuccess = (event: { key: string }) => {
    console.log('On Success', event.key);
  };

  const onError = (err: string) => {
    console.log('error', err);
  };
  return (
    <>
      <Authenticator>
        {({ signOut, user }) => (
          <main>
            <h1>Hello {user?.username}</h1>
            <button onClick={signOut}>Sign out</button>
          </main>
        )}
      </Authenticator>
      {/**
       * You can also try these props for the <FileUploader></FileUploader>
       * maxSize: number  // largest file uploader will accept in bytes
       * maxFiles: number // the maximum number of files the file uploader will accept
       * fileNames: string[] // when uploading files you can use this to use these file name instead
       */}
      <FileUploader
        multiple={true} // allow you to add more then 1 file to uploader
        isPreviewerVisible={false} // starts off with previewer page
        variation="drop" // Shows a button if set to 'button', shows drop or a button if set to 'drop'
        onSuccess={onSuccess} // callback function that prints out key when files are succesffully uploaded
        onError={onError} // callback function called when error occurs during upload (Note Amplify errors do not show here, look in console)
        level="public" //  Can be set to private, public or protected. You must be logged in to upload protected or private
        acceptedFileTypes={['.png', '.jpg']} // array of file types you can add
      />
    </>
  );
}

export default App;
