import React, { useMemo } from 'react';

import {
  AuthenticatorProvider as Provider,
  AuthenticatorMachineContext,
  resolveAuthenticatorComponents,
  useAuthenticator,
  useAuthenticatorRoute,
  useAuthenticatorInitMachine,
  UseAuthenticator,
} from '@aws-amplify/ui-react-core';

import { AuthenticatorProps } from './types';

import {
  ConfirmResetPassword,
  ConfirmSignIn,
  ConfirmSignUp,
  ConfirmVerifyUser,
  ForceNewPassword,
  ResetPassword,
  SetupTOTP,
  SignIn,
  SignUp,
  TypedField,
  VerifyUser,
} from './Defaults';

import { DefaultContainer } from './common';

const DEFAULTS = {
  ConfirmResetPassword,
  ConfirmSignIn,
  ConfirmSignUp,
  ConfirmVerifyUser,
  ForceNewPassword,
  ResetPassword,
  SetupTOTP,
  SignIn,
  SignUp,
  VerifyUser,
};

const isAuthenticatedRoute = (route: UseAuthenticator['route']) =>
  route === 'authenticated' || route === 'signOut';

const routePropSelector = ({
  route,
}: AuthenticatorMachineContext): AuthenticatorMachineContext['route'][] => [
  route,
];

function Authenticator({
  children,
  components: overrides,
  ...options
}: AuthenticatorProps): JSX.Element | null {
  useAuthenticatorInitMachine(options);

  const { fields, route } = useAuthenticator(routePropSelector);

  const components = useMemo(
    // allow any to prevent TS from assuming that all fields are of type `TextFieldOptions`
    () => resolveAuthenticatorComponents<TypedField | any>(DEFAULTS, overrides),
    [overrides]
  );

  const { Component, props } = useAuthenticatorRoute<any>({ components });

  if (isAuthenticatedRoute(route)) {
    return children ? <>{children}</> : null;
  }

  return (
    <DefaultContainer>
      <Component {...props} fields={fields} />
    </DefaultContainer>
  );
}

// assign slot components
Authenticator.Provider = Provider;
Authenticator.ConfirmResetPassword = ConfirmResetPassword;
Authenticator.ConfirmSignIn = ConfirmSignIn;
Authenticator.ConfirmSignUp = ConfirmSignUp;
Authenticator.ConfirmVerifyUser = ConfirmVerifyUser;
Authenticator.ForceNewPassword = ForceNewPassword;
Authenticator.ResetPassword = ResetPassword;
Authenticator.SetupTOTP = SetupTOTP;
Authenticator.SignIn = SignIn;
Authenticator.SignUp = SignUp;
Authenticator.VerifyUser = VerifyUser;

export default Authenticator;
