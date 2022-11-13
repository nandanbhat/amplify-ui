import React from 'react';

import {
  getLogger,
  getCurrentMFA,
  setPreferredMFA,
  translate,
  setupTOTP,
  verifyTOTPToken,
  UserPhoneInfo,
  AmplifyUser,
  getUserPhoneInfo,
  verifyUserAttribute,
  updateUserAttributes,
} from '@aws-amplify/ui';

import { useAuth } from '../../../internal';
import { Flex } from '../../../primitives';
import { FormValues } from '../types';
import { MFAOption } from './MFAOption';
import {
  ConfigureSMS,
  ConfigureTOTP,
  DisplayCurrentMFA,
  EnableMFAButton,
  Error,
  SelectMFA,
  VerifySMS,
} from './defaults';
import { ConfigureMFAProps, ConfigureMFAState, MFAType } from './types';

const logger = getLogger('Auth');

function SetupMFA({
  children,
  onError,
}: ConfigureMFAProps): JSX.Element | null {
  const [state, setState] = React.useState<ConfigureMFAState>('IDLE');
  const [currentMFA, setCurrentMFA] = React.useState<string>(null);
  // desired mfa type that end user selects
  const [desiredMFA, setDesiredMFA] = React.useState<string>(null);
  const [formValues, setFormValues] = React.useState<FormValues>(null);
  const [phoneInfo, setPhoneInfo] = React.useState<UserPhoneInfo>(null);
  const [errorMessage, setErrorMessage] = React.useState<string>(null);
  const [_destination, setDestination] = React.useState<string>(null);
  const { user, isLoading } = useAuth();
  // translations
  const enableMFAText = translate('Enable multi-factor authentication');
  const fetchCurrentMFA = React.useCallback(async () => {
    if (user) {
      try {
        const currentMFASetting = await getCurrentMFA(user);
        setCurrentMFA(currentMFASetting);
      } catch (e) {
        const error = e as Error;
        setErrorMessage(error.message);
      }
    }
  }, [user]);

  const hasFetched = React.useRef<boolean>(false);

  // get current mfa settings for current user
  React.useEffect(() => {
    const runFetch = async () => {
      await fetchCurrentMFA();
      hasFetched.current = true;
    };
    if (user && !hasFetched.current) {
      runFetch();
    }
  }, [user, fetchCurrentMFA]);

  const isMFADisabled = React.useMemo(
    () => currentMFA === 'NOMFA',
    [currentMFA]
  );

  // transition methods
  const toIdle = React.useCallback(() => {
    setFormValues({});
    setDesiredMFA(null);
    setState('IDLE');
  }, []);

  const toSelectMFA = React.useCallback(() => {
    setFormValues({});
    setDesiredMFA(null);
    setState('SELECT_MFA');
  }, []);

  // API calls
  const runVerifyTOTPToken = React.useCallback(
    async (code: string) => {
      try {
        await verifyTOTPToken({ user, code });

        // move to an intermediary state so that `SetupTOTP` doesn't remount
        // and call `Auth.setupTOTP` in parallel
        setState('LOADING');
        await setPreferredMFA({ user, mfaType: 'TOTP' });

        // mfa has been succesfully changed!
        setCurrentMFA('TOTP');
        setState('DONE');
      } catch (e) {
        const error = e as Error;
        onError?.(error);
        setErrorMessage(error.message);
      }
    },
    [onError, user]
  );

  const runDisableMFA = React.useCallback(async () => {
    try {
      await setPreferredMFA({ user, mfaType: 'NOMFA' });
      setCurrentMFA('NOMFA');
      setState('DONE');
    } catch (e) {
      const error = e as Error;
      onError?.(error);
    }
  }, [user, onError]);

  const getTotpSecretCode = React.useCallback((user: AmplifyUser) => {
    return () => {
      return setupTOTP(user);
    };
  }, []);

  const runVerifyPhone = React.useCallback(
    async (user: AmplifyUser, formValues: FormValues) => {
      const { dialCode, phoneNumber } = formValues;
      const fullPhoneNumber = `+${dialCode}${phoneNumber}`;
      if (phoneInfo.hasPhoneNumber) {
        // user had a phone number registered already, just reverify phone number
        await verifyUserAttribute({ user, attr: 'phone_number' });
      } else {
        // else, user registers a new phone. Verification code will be sent automatically.
        await updateUserAttributes({
          user,
          attributes: { phone_number: fullPhoneNumber },
        });
      }
      setDestination(fullPhoneNumber);
      setState('VERIFY_SMS');
    },
    [phoneInfo]
  );

  // event handlers
  const handleEnableMFA = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setState('SELECT_MFA');
  };

  const handleDisableMFA = React.useCallback(() => {
    runDisableMFA();
  }, [runDisableMFA]);

  const handleSelectMFAChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      const { name, value } = event.target;
      if (name === 'mfaType') {
        setDesiredMFA(value);
      }
    },
    []
  );

  const handleSelectMFASubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      switch (desiredMFA) {
        case 'SMS': {
          const userPhoneInfo = getUserPhoneInfo(user);
          const { dialCode, phoneNumber } = userPhoneInfo;

          // set initial values
          setFormValues({ dialCode, phoneNumber });
          setPhoneInfo(userPhoneInfo);
          setState('CONFIGURE_SMS');
          break;
        }
        case 'TOTP': {
          setState('CONFIGURE_TOTP');
          break;
        }
        default: {
          logger.error('Unknown mfa was selected:', desiredMFA);
          break;
        }
      }
    },
    [desiredMFA, user]
  );

  const handleConfigureTOTPSubmit = React.useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const { code } = formValues;
      runVerifyTOTPToken(code);
    },
    [runVerifyTOTPToken, formValues]
  );

  const handleCodeChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      const { name, value } = event.target;
      setFormValues({ ...formValues, [name]: value });
    },
    [formValues]
  );

  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setFormValues((formValues) => ({ ...formValues, [name]: value }));
  };

  const handleConfigureSMSSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    runVerifyPhone(user, formValues);
  };

  // Return null if user isn't authenticated in the first place
  if (!user) {
    logger.warn('<SetupMFA /> requires user to be authenticated.');
    return null;
  }

  // Return null if Auth.getCurrentAuthenticatedUser is still in progress
  if (isLoading) {
    return null;
  }

  // return null if mfaType hasn't been fetched yet
  if (!currentMFA) {
    return null;
  }

  return (
    <Flex direction="column" className="amplify-configuremfa">
      {state === 'IDLE' || state === 'DONE' ? (
        <>
          {isMFADisabled ? (
            <EnableMFAButton onClick={handleEnableMFA}>
              {enableMFAText}
            </EnableMFAButton>
          ) : (
            <DisplayCurrentMFA
              currentMFA={currentMFA as MFAType}
              onDisableMFA={handleDisableMFA}
              onUpdateMFA={toSelectMFA}
            />
          )}
        </>
      ) : null}
      {state === 'SELECT_MFA' ? (
        <SelectMFA
          onSubmit={handleSelectMFASubmit}
          onChange={handleSelectMFAChange}
          onCancel={toIdle}
          isDisabled={!desiredMFA}
        >
          {children}
        </SelectMFA>
      ) : null}
      {state === 'CONFIGURE_TOTP' ? (
        <ConfigureTOTP
          onCancel={toSelectMFA}
          getTotpSecretCode={getTotpSecretCode(user)}
          onChange={handleCodeChange}
          onSubmit={handleConfigureTOTPSubmit}
          totpIssuer="AWSCognito"
          totpUsername={user.username}
        />
      ) : null}
      {state === 'CONFIGURE_SMS' ? (
        <ConfigureSMS
          hasPhoneNumber={phoneInfo.hasPhoneNumber}
          defaultDialCode={phoneInfo.dialCode}
          isVerified={phoneInfo.isVerified}
          formValues={formValues}
          onCancel={toSelectMFA}
          onChange={handleChange}
          onDialCodeChange={handleChange}
          onSubmit={handleConfigureSMSSubmit}
        />
      ) : null}
      {state === 'VERIFY_SMS' ? <VerifySMS /> : null}

      {errorMessage ? <Error>{errorMessage}</Error> : null}
    </Flex>
  );
}

SetupMFA.Option = MFAOption;

export default SetupMFA;
