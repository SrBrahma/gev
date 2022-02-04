// https://docs.expo.dev/guides/using-custom-fonts/
// I first shared it in here: https://github.com/expo/google-fonts/issues/6
import { Platform } from 'react-native';
import {
  MaterialCommunityIcons // Commonly used
} from '@expo/vector-icons';
// import * as DM_Sans from '@expo-google-fonts/dm-sans';
// import * as Inter from '@expo-google-fonts/inter';
import * as Roboto from '@expo-google-fonts/roboto'; // Aditional fontWeights and to be used on iOS
import { useFonts } from 'expo-font';


// Instead of using the useFonts(fontsArg) hook to get the loaded state, use useMyFonts().

/** Enter here your fonts to be loaded.
 *
 * You may enter in the object `...Roboto` for example to load the whole family,
 * or `Roboto.Roboto_500Medium` to only load the specific font. */
const fontsToLoad = {
  ...Roboto,
};

// Enter here your icons to be used and loaded/cached on start.
/** Use the icons via `<Icons.MaterialCommunityIcons/>` */
export const Icons = {
  MaterialCommunityIcons,
};

// Manual system fonts aliases to be added to F.
const additional = {
  monospace: Platform.OS === 'ios' ? 'Courier' : 'monospace',
};


/** Fonts. `F` instead of `Fonts` as it's commonly used.
 *
 * In your component style, use `{ fontFamily: F.Roboto_500Medium }`.
 *
 * It's type-smart! Intellisense will autofill and TS will complain if it's wrong */
export const F = getFont()



// === Implementation ===

const iconsFonts = (Object.fromEntries(Object.entries(Icons).map(([iconName, icon]) => ([iconName, icon.font]))));

const useFontsArg = {
  ...(fontsToLoad as Omit<typeof fontsToLoad, '__metadata__' | 'useFonts'>),
  ...iconsFonts,
};

// Remove not-font stuff
delete (useFontsArg as any).__metadata__;
delete (useFontsArg as any).useFonts;

type PropsToString<Obj> = { [K in keyof Obj]: string };

// Prettify obj type
type Id<T> = unknown & { [P in keyof T]: T[P] };


function getFont() {
  return {
    ...Object.fromEntries(Object.keys(useFontsArg).map((key) => [key, key])),
    ...additional,
  } as Id<PropsToString<typeof useFontsArg> & typeof additional>;
}

export function useMyFonts(): [fontsLoaded: boolean, error: Error | null] {
  return useFonts(useFontsArg);
}
