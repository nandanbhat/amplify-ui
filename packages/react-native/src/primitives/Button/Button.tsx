import React, { useCallback } from 'react';
import {
  Pressable,
  PressableStateCallbackType,
  StyleProp,
  Text,
  ViewStyle,
} from 'react-native';

import { useTheme } from '../../theme';
import { getThemedStyles } from './styles';
import { ButtonProps } from './types';

export default function Button({
  accessibilityRole = 'button',
  children,
  style,
  textStyle,
  ...rest
}: ButtonProps): JSX.Element {
  const theme = useTheme();
  const themedStyle = getThemedStyles(theme);

  const pressableStyle = useCallback(
    ({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> => {
      const pressedStateStyle =
        (typeof style === 'function' ? style({ pressed }) : style) ?? null;
      return [pressed ? themedStyle.pressed : null, pressedStateStyle];
    },
    [style, themedStyle]
  );

  return (
    <Pressable
      {...rest}
      accessibilityRole={accessibilityRole}
      style={pressableStyle}
    >
      {typeof children === 'string' ? (
        <Text style={[themedStyle.text, textStyle]}>{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
