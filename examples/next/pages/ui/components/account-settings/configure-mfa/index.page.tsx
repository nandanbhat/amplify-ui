import { Amplify, Logger } from 'aws-amplify';

import {
  Authenticator,
  Button,
  Card,
  Flex,
  Heading,
  ConfigureMFA,
  withAuthenticator,
} from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import awsExports from './aws-exports';
Amplify.configure(awsExports);

Logger.LOG_LEVEL = 'DEBUG';

function App({ signOut }) {
  return (
    <Card width="600px">
      <Flex direction="column">
        <Card variation="outlined">
          <Flex direction="column">
            <Heading>Configure MFA:</Heading>
            <ConfigureMFA>
              <ConfigureMFA.Option mfaType="SMS"></ConfigureMFA.Option>
              <ConfigureMFA.Option mfaType="TOTP"></ConfigureMFA.Option>
            </ConfigureMFA>
          </Flex>
        </Card>
        <Button onClick={signOut}>Sign Out</Button>
      </Flex>
    </Card>
  );
}

export default withAuthenticator(App);
