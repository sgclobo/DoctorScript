import { IconSymbol } from "@/components/ui/icon-symbol";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Linking,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type AboutTab = "about" | "guide";

export default function AboutScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<AboutTab>("about");

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <View className="px-6 py-4 flex-row items-center justify-between border-b border-outline_variant">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center gap-2"
        >
          <IconSymbol name="chevron.left" size={22} color="#00488d" />
          <Text className="font-display font-bold text-primary text-lg">
            {t("about_back")}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="px-6 pt-6">
        <Text className="font-display text-3xl font-extrabold text-on_surface text-center mb-2">
          {t("about_title")}
        </Text>
        <Text className="text-on_surface_variant text-center mb-6">
          {t("about_subtitle")}
        </Text>

        <View className="flex-row rounded-xl bg-surface_container_low p-1 mb-4">
          <TouchableOpacity
            className={`flex-1 py-3 rounded-lg items-center ${activeTab === "about" ? "bg-primary" : "bg-transparent"}`}
            onPress={() => setActiveTab("about")}
          >
            <Text
              className={`font-bold ${activeTab === "about" ? "text-white" : "text-on_surface"}`}
            >
              {t("about_tab_about")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-3 rounded-lg items-center ${activeTab === "guide" ? "bg-primary" : "bg-transparent"}`}
            onPress={() => setActiveTab("guide")}
          >
            <Text
              className={`font-bold ${activeTab === "guide" ? "text-white" : "text-on_surface"}`}
            >
              {t("about_tab_guide")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerClassName="px-6 pb-24">
        {activeTab === "about" ? (
          <View className="bg-surface_container_lowest p-6 rounded-xl border border-outline_variant">
            <Text className="text-xl font-display font-bold text-on_surface mb-2">
              DoctorScript
            </Text>
            <Text className="text-on_surface_variant mb-3">
              {t("about_created_by")}
            </Text>
            <Text className="text-on_surface_variant mb-2">
              {t("about_description")}
            </Text>
            <Text className="text-on_surface_variant mb-2">
              {t("about_features")}
            </Text>
            <Text className="text-on_surface_variant">
              {t("about_privacy")}
            </Text>

            <View className="mt-6 pt-4 border-t border-outline_variant gap-3">
              <View className="flex-row items-center gap-3">
                <IconSymbol name="envelope.fill" size={18} color="#00488d" />
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL("mailto:timordigitalnet@gmail.com")
                  }
                >
                  <Text className="text-primary font-medium">
                    timordigitalnet@gmail.com
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="flex-row items-center gap-3">
                <IconSymbol name="message.fill" size={18} color="#1f8f44" />
                <TouchableOpacity
                  onPress={() => Linking.openURL("https://wa.me/67078482777")}
                >
                  <Text className="text-primary font-medium">+67078482777</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <View className="bg-surface_container_lowest p-6 rounded-xl border border-outline_variant">
            <Text className="text-lg font-display font-bold text-on_surface mb-3">
              {t("guide_step_1_title")}
            </Text>
            <Text className="text-on_surface_variant mb-4">
              {t("guide_step_1_desc")}
            </Text>

            <Text className="text-lg font-display font-bold text-on_surface mb-3">
              {t("guide_step_2_title")}
            </Text>
            <Text className="text-on_surface_variant mb-4">
              {t("guide_step_2_desc")}
            </Text>

            <Text className="text-lg font-display font-bold text-on_surface mb-3">
              {t("guide_step_3_title")}
            </Text>
            <Text className="text-on_surface_variant mb-4">
              {t("guide_step_3_desc")}
            </Text>

            <Text className="text-lg font-display font-bold text-on_surface mb-3">
              {t("guide_step_4_title")}
            </Text>
            <Text className="text-on_surface_variant mb-4">
              {t("guide_step_4_desc")}
            </Text>

            <Text className="text-lg font-display font-bold text-on_surface mb-3">
              {t("guide_step_5_title")}
            </Text>
            <Text className="text-on_surface_variant mb-2">
              {t("guide_step_5_desc_1")}
            </Text>
            <Text className="text-on_surface_variant mb-2">
              {t("guide_step_5_desc_2")}
            </Text>
            <Text className="text-on_surface_variant">
              {t("guide_step_5_desc_3")}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
