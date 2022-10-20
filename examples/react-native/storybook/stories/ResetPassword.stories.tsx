import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { ResetPassword } from '@aws-amplify/ui-react-native/dist/Authenticator/Defaults';

const props = {} as any;

storiesOf('ResetPassword', module)
  .add('default', () => <ResetPassword {...props} />)
  .add('header', () => <ResetPassword.Header />)
  .add('footer', () => <ResetPassword.Footer />)
  .add('formFields', () => <ResetPassword.FormFields {...props} />);
