import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "../theme";
import { posterUrl } from "../services/tmdbApi";
import type { Movie } from "../types";

export default function MovieCard({ movie, onPress }: { movie: Movie; onPress?: () => void }) {
  const uri = posterUrl(movie.poster_Path, "w342");
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={`Abrir detalhes de ${movie.title}`} hitSlop={8} style={styles.card}>
      {uri ? (
        <Image source={{ uri }} style={styles.poster} accessible accessibilityLabel={`Pôster do filme ${movie.title}`} />
      ) : (
        <View style={[styles.poster, styles.placeholder]} />
      )}
      <Text numberOfLines={1} style={styles.title}>{movie.title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { width: 140, marginRight: spacing(2) },
  poster: { width: 140, height: 200, borderRadius: 16, backgroundColor: colors.separator },
  placeholder: { alignItems: "center", justifyContent: "center" },
  title: { color: colors.text, marginTop: 6, fontWeight: "600" }
});