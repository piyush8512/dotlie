import { Tabs, usePathname, useRouter } from "expo-router";
import BottomBar from "../../src/components/BottomBar";

export default function TabsLayout() {
  const pathname = usePathname();
  const router = useRouter();

  const active = pathname.endsWith("/wallpaper")
    ? "wallpaper"
    : pathname.endsWith("/profile")
      ? "profile"
      : pathname.endsWith("/task")
        ? "task"
        : "home";

  const handleChange = (key: string) => {
    switch (key) {
      case "home":
        router.push("/(tabs)");
        break;

      case "wallpaper":
        router.push("/(tabs)/wallpaper");
        break;

      case "profile":
        router.push("/(tabs)/profile");
        break;

      case "task":
        router.push("/(tabs)/task");
        break;
    }
  };

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          animation: "none",
          sceneStyle: { backgroundColor: "#000" },
          tabBarStyle: {
            display: "none",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Trackers",
          }}
        />
        <Tabs.Screen
          name="task"
          options={{
            title: "Task",
          }}
        />

        <Tabs.Screen
          name="wallpaper"
          options={{
            title: "Wallpaper",
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
          }}
        />
      </Tabs>

      <BottomBar
        tabs={[
          {
            key: "home",
            label: "Trackers",
            icon: "apps-outline",
          },
          {
            key: "task",
            label: "Task",
            icon: "checkbox-outline",
          },
          {
            key: "wallpaper",
            label: "Wallpaper",
            icon: "image-outline",
          },
          {
            key: "profile",
            label: "Profile",
            icon: "person-outline",
          },
        ]}
        active={active}
        onChange={handleChange}
        avatarUri="https://i.pravatar.cc/150?img=12"
      />
    </>
  );
}
