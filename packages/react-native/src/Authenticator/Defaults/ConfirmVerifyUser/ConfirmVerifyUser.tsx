import React from 'react';

import { DefaultFooter } from '../../common/DefaultFooter';
import { DefaultHeader } from '../../common/DefaultHeader';
import { DefaultFormFields } from '../../common/DefaultFormFields';
import { Button, ErrorMessage } from '../../../primitives';
import { DefaultConfirmVerifyUserComponent } from '../types';
import { authenticatorTextUtil } from '@aws-amplify/ui';
import { styles } from './styles';

const { getAccountRecoveryInfoText, getSkipText } = authenticatorTextUtil;

const ConfirmVerifyUser: DefaultConfirmVerifyUserComponent = ({
  error,
  fields,
  FormFields,
  Footer,
  Header,
  isPending,
  skipVerification,
}) => {
  return (
    <>
      <Header>{getAccountRecoveryInfoText()}</Header>
      <FormFields isPending={isPending} fields={fields} />
      {error ? <ErrorMessage>{error}</ErrorMessage> : null}
      <Button
        onPress={skipVerification}
        style={styles.buttonSecondary}
        textStyle={styles.buttonSecondaryLabel}
      >
        {getSkipText()}
      </Button>
      <Footer />
    </>
  );
};

ConfirmVerifyUser.Footer = DefaultFooter;
ConfirmVerifyUser.FormFields = DefaultFormFields;
ConfirmVerifyUser.Header = DefaultHeader;

ConfirmVerifyUser.displayName = 'ConfirmVerifyUser';
export default ConfirmVerifyUser;
