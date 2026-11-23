import { StyleSheet, View } from 'react-native';
import { Text } from './Text';
import { fonts } from '../theme/tokens';

// A simple lotus for each chakra, drawn with plain views (no image files, no extra
// libraries): a ring of petals in the chakra colour around a centre carrying its seed
// sound. Petal counts follow the traditional lotuses.
const PETALS: Record<string, number> = {
  root: 4, sacral: 6, solarPlexus: 10, heart: 12, throat: 16, thirdEye: 2, crown: 12,
};

export function ChakraSymbol({
  id, color, mantra, size, onColor,
}: { id: string; color: string; mantra: string; size: number; onColor: string }) {
  const n = PETALS[id] ?? 8;
  const centre = size * 0.46;
  const petalLen = size * 0.36;
  const petalW = Math.min(size * 0.3, (2 * Math.PI * (size * 0.34)) / n * 0.92);
  return (
    <View style={{ width: size, height: size }} accessible={false}>
      {Array.from({ length: n }, (_, i) => (
        <View key={i} style={[{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }, { transform: [{ rotate: `${(360 / n) * i}deg` }] }]}>
          <View
            style={{
              position: 'absolute', top: 0, left: (size - petalW) / 2,
              width: petalW, height: petalLen + size * 0.04,
              borderRadius: petalW / 2, backgroundColor: color, opacity: 0.62,
            }}
          />
        </View>
      ))}
      <View
        style={{
          position: 'absolute', left: (size - centre) / 2, top: (size - centre) / 2,
          width: centre, height: centre, borderRadius: centre / 2, backgroundColor: color,
          borderWidth: 2, borderColor: '#FDEDDC', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <Text style={{ fontFamily: fonts.bodyBold, color: onColor, fontSize: Math.max(11, centre * 0.27), letterSpacing: 1 }}>
          {mantra}
        </Text>
      </View>
    </View>
  );
}
