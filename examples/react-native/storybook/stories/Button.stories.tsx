import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';
import { storiesOf } from '@storybook/react-native';
import { Button } from '@aws-amplify/ui-react-native/dist/primitives';

storiesOf('Button', module)
  .add('with text', () => (
    <Button onPress={action('clicked-text')}>
      <Text>{text('Button text', 'Hello Button')}</Text>
    </Button>
  ))
  .add('with emoji', () => (
    <Button onPress={action('clicked-emoji')}>
      <Text>😀 😎 👍 💯</Text>
    </Button>
  ))
  .add('disabled', () => <Button disabled>Disabled Button</Button>)
  .add('styles', () => (
    <Button style={styles.container} textStyle={styles.whiteText}>
      White text, blue background
    </Button>
  ));

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'blue',
    borderRadius: 5,
    padding: 10,
  },
  whiteText: {
    color: 'white',
    fontWeight: '900',
  },
});
