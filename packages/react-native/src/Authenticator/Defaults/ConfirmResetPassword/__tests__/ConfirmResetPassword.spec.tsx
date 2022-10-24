import React from 'react';
import { render } from '@testing-library/react-native';

import { ConfirmResetPassword } from '..';

const props = {} as any;

describe('ConfirmResetPassword', () => {
  it('renders as expected', () => {
    const { toJSON, getByRole } = render(
      <>
        <ConfirmResetPassword {...props} />
        <ConfirmResetPassword.Header />
        <ConfirmResetPassword.Footer />
        <ConfirmResetPassword.FormFields {...props} />
      </>
    );
    expect(toJSON()).toMatchSnapshot();

    expect(getByRole('header')).toBeDefined();
  });
});
