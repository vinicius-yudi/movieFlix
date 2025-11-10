import { Pressable, Text, View } from "react-native";

export default function RatingStars({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const stars = Array.from({ length: 10 }, (_, i) => i + 1);
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }} accessible accessibilityRole="adjustable" accessibilityLabel={`Avaliação atual ${value} de 10`}>
      {stars.map((s) => (
        <Pressable key={s} onPress={() => onChange(s)} hitSlop={10} accessibilityLabel={`Definir nota ${s}`} style={{ padding: 6 }}>
          <Text style={{ fontSize: 18 }}>{s <= value ? "★" : "☆"}</Text>
        </Pressable>
      ))}
    </View>
  );
}