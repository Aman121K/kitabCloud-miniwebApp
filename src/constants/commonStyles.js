import { colors } from './colors';
import { fonts } from './fonts';

export const commonStyles = {
    // Text styles
    textLightBold: (size, additionalStyles = {}) => ({
        fontSize: size,
        fontWeight: '600',
        fontFamily: fonts.fontHeading,
        color: colors.black,
        ...additionalStyles
    }),
    textLightNormal: (size, additionalStyles = {}) => ({
        fontSize: size,
        fontWeight: '400',
        fontFamily: fonts.fontContent,
        color: colors.black,
        ...additionalStyles
    }),
    textWhiteBold: (size, additionalStyles = {}) => ({
        fontSize: size,
        fontWeight: '600',
        fontFamily: fonts.fontHeading,
        color: colors.white,
        ...additionalStyles
    }),
    textWhiteNormal: (size, additionalStyles = {}) => ({
        fontSize: size,
        fontWeight: '400',
        fontFamily: fonts.fontContent,
        color: colors.white,
        ...additionalStyles
    }),

    // Layout styles
    flexFull: {
        flex: 1
    },
    fullScreenContainer: {
        minHeight: '100vh',
        backgroundColor: colors.white
    },
    fullScreenInnerContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 40
    },
    centerContent: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    rowCenter: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    spaceBetween: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
} 