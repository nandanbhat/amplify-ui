import React from 'react';
import { render } from '@testing-library/react-native';

import { ConfirmSignUp } from '..';

const props = {} as any;

describe('ConfirmSignUp', () => {
  it('renders as expected', () => {
    const { toJSON, getByRole } = render(
      <>
        <ConfirmSignUp {...props} />
        <ConfirmSignUp.Header />
        <ConfirmSignUp.Footer />
        <ConfirmSignUp.FormFields {...props} />
      </>
    );
    expect(toJSON()).toMatchSnapshot();

    expect(getByRole('header')).toBeDefined();
  });
});
