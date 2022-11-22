import * as React from 'react';
import { render, screen } from '@testing-library/react';

import { Tracker } from '..';
const fakeFile = new File(['hello'], 'hello.png', { type: 'image/png' });

describe('Tracker', () => {
  it('exists', async () => {
    const { container } = render(
      <Tracker
        file={fakeFile}
        hasImage={true}
        fileState={null}
        onChange={() => {}}
        onCancel={() => {}}
        name={'hello.png'}
        onPause={() => {}}
        onResume={() => {}}
        percentage={0}
        errorMessage={''}
        onSaveEdit={() => null}
        onStartEdit={() => null}
        onCancelEdit={() => null}
        showImage={true}
      />
    );

    expect(container).toMatchSnapshot();
  });
  it('shows the name of the file', async () => {
    const fileName = 'hello2.png';
    render(
      <Tracker
        file={fakeFile}
        fileState={null}
        hasImage={true}
        onChange={() => {}}
        onCancel={() => {}}
        name={fileName}
        onPause={() => {}}
        onResume={() => {}}
        percentage={0}
        errorMessage={''}
        onSaveEdit={() => null}
        onStartEdit={() => null}
        onCancelEdit={() => null}
        showImage={true}
      />
    );

    const name = await screen.findByText(fileName);

    expect(name).toMatchSnapshot();
  });
  it('shows the file size', async () => {
    const fileName = 'hello2.png';
    render(
      <Tracker
        file={fakeFile}
        fileState={null}
        hasImage={true}
        onChange={() => {}}
        onCancel={() => {}}
        name={fileName}
        onPause={() => {}}
        onResume={() => {}}
        percentage={0}
        errorMessage={''}
        onSaveEdit={() => null}
        onStartEdit={() => null}
        onCancelEdit={() => null}
        showImage={true}
      />
    );

    const name = await screen.findByText('5 B');

    expect(name).toMatchSnapshot();
  });
});
