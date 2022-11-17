import { StyleSheet } from 'react-native';

import { StrictTheme } from '../../theme';
import { RADIO_DOT_PROPORTION } from './getRadioDimensions';
import { RadioStyles } from './types';

const ROUNDED_BORDER_RADIUS = 999;

export const getThemedStyles = (theme: StrictTheme): Required<RadioStyles> => {
  const {
    components,
    tokens: { colors, fontSizes, opacities },
  } = theme;

  return StyleSheet.create({
    container: {
      alignItems: 'center',
      ...components?.radio?.container,
    },
    disabled: {
      opacity: opacities[60],
      ...components?.radio?.disabled,
    },
    radioContainer: {
      alignItems: 'center',
      borderColor: colors.border.primary,
      borderRadius: ROUNDED_BORDER_RADIUS,
      // TODO: get borderWidths in base tokens
      borderWidth: 2,
      justifyContent: 'center',
      ...components?.radio?.radioContainer,
    },
    radioDot: {
      backgroundColor: colors.brand.primary[80],
      borderRadius: ROUNDED_BORDER_RADIUS,
      ...components?.radio?.radioDot,
    },
    radioContainerLarge: {
      height: fontSizes.xl,
      width: fontSizes.xl,
      ...components?.radio?.radioContainerLarge,
    },
    radioContainerMedium: {
      height: fontSizes.large,
      width: fontSizes.large,
      ...components?.radio?.radioContainerMedium,
    },
    radioContainerSmall: {
      height: fontSizes.medium,
      width: fontSizes.medium,
      ...components?.radio?.radioContainerSmall,
    },
    radioDotLarge: {
      height: fontSizes.xl * RADIO_DOT_PROPORTION,
      width: fontSizes.xl * RADIO_DOT_PROPORTION,
      ...components?.radio?.radioDotLarge,
    },
    radioDotMedium: {
      height: fontSizes.large * RADIO_DOT_PROPORTION,
      width: fontSizes.large * RADIO_DOT_PROPORTION,
      ...components?.radio?.radioDotMedium,
    },
    radioDotSmall: {
      height: fontSizes.medium * RADIO_DOT_PROPORTION,
      width: fontSizes.medium * RADIO_DOT_PROPORTION,
      ...components?.radio?.radioDotSmall,
    },
  });
};
