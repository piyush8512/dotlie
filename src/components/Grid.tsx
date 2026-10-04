import { View } from "react-native";

type Dot = { fill: string; alpha?: number };
export default function Grid({
  groups,
  direction = "rows",
  size = 30,
  gap = 30,
}: {
  groups: Dot[][];
  direction?: "rows" | "columns";
  size?: number;
  gap?: number;
}) {
  return (
    <View
      style={{ gap, flexDirection: direction === "rows" ? "column" : "row" }}
    >
      {groups.map((group, groupIndex) => (
        <View
          key={groupIndex}
          style={{
            gap,
            flexDirection: direction === "rows" ? "row" : "column",
          }}
        >
          {group.map((dot, index) => (
            <View
              key={index}
              style={{
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: dot.fill,
                opacity: dot.alpha ?? 1,
              }}
            />
          ))}
        </View>
      ))}
    </View>
  );
}
