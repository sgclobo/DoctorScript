import { IconSymbol } from "@/components/ui/icon-symbol";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const terms = [
  { latin: "bis in die", abbr: "b.i.d. / bd", meaning: "Twice a day" },
  {
    latin: "ter in die",
    abbr: "t.i.d. / td / tds",
    meaning: "Three times a day",
  },
  { latin: "quater in die", abbr: "q.i.d. / qds", meaning: "Four times a day" },
  { latin: "quaque die", abbr: "q.d. / od", meaning: "Every day / once daily" },
  { latin: "omni nocte", abbr: "o.n.", meaning: "Every night" },
  { latin: "quaque hora", abbr: "q.h.", meaning: "Every hour" },
  { latin: "quaque 4 hora", abbr: "q.4h", meaning: "Every 4 hours" },
  { latin: "quaque 6 hora", abbr: "q.6h", meaning: "Every 6 hours" },
  { latin: "quaque 8 hora", abbr: "q.8h", meaning: "Every 8 hours" },
  { latin: "quaque mane", abbr: "q.a.m.", meaning: "Every morning" },
  { latin: "quaque nocte", abbr: "q.n.", meaning: "Every night" },
  { latin: "alternis horis", abbr: "alt. h.", meaning: "Every other hour" },
  {
    latin: "pro re nata",
    abbr: "p.r.n.",
    meaning: "As needed / when required",
  },
  { latin: "statim", abbr: "stat", meaning: "Immediately" },
  { latin: "ad libitum", abbr: "ad lib", meaning: "As desired / freely" },
  { latin: "hora somni", abbr: "h.s.", meaning: "At bedtime" },
  { latin: "ante meridiem", abbr: "a.m.", meaning: "Before noon" },
  { latin: "post meridiem", abbr: "p.m.", meaning: "After noon" },
  { latin: "exempli gratia", abbr: "e.g.", meaning: "For example" },
  { latin: "id est", abbr: "i.e.", meaning: "That is" },
  { latin: "mane", abbr: "mane", meaning: "In the morning" },
  { latin: "nocte", abbr: "nocte", meaning: "At night" },
  { latin: "semel in die", abbr: "s.i.d.", meaning: "Once a day" },
  { latin: "quaque altera die", abbr: "q.a.d.", meaning: "Every other day" },
  { latin: "per os", abbr: "p.o.", meaning: "By mouth / orally" },
  { latin: "sub lingua", abbr: "s.l.", meaning: "Under the tongue" },
  { latin: "intra venam", abbr: "i.v.", meaning: "Into a vein" },
  { latin: "intra musculum", abbr: "i.m.", meaning: "Into a muscle" },
  { latin: "ante cibum", abbr: "a.c.", meaning: "Before meals" },
  { latin: "post cibum", abbr: "p.c.", meaning: "After meals" },
  { latin: "cibos", abbr: "c", meaning: "With food" },
];

export default function HelpScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const filteredTerms = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return terms;
    }

    return terms.filter((term) =>
      `${term.latin} ${term.abbr} ${term.meaning}`.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={["top"]}>
      <View className="px-6 py-4 flex-row items-center justify-between border-b border-outline_variant">
        <View className="flex-row items-center gap-3">
          <IconSymbol name="cross.case.fill" size={24} color="#00488d" />
          <Text className="text-xl font-display font-extrabold text-primary">
            DoctorScript
          </Text>
        </View>
        <TouchableOpacity
          className="w-10 h-10 rounded-full bg-surface_container_high items-center justify-center"
          onPress={() => router.push("/about")}
        >
          <IconSymbol name="info.circle.fill" size={20} color="#00488d" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerClassName="px-6 py-8 pb-24">
        <View className="mb-8 items-center">
          <Text className="text-primary font-bold tracking-wider text-xs uppercase mb-1 text-center">
            {t("help_reference")}
          </Text>
          <Text className="font-display text-4xl font-extrabold text-on_surface leading-tight mb-2 text-center">
            {t("help_title")}
          </Text>
          <Text className="text-on_surface_variant text-center">
            {t("help_subtitle")}
          </Text>
        </View>

        <View className="bg-surface_container_lowest p-4 rounded-xl border border-outline_variant mb-4">
          <TextInput
            className="w-full bg-surface_container_low border-0 p-4 rounded-lg text-on_surface font-medium"
            placeholder={t("help_search_placeholder")}
            placeholderTextColor="#727783"
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Text className="text-xs text-on_surface_variant mt-3">
            {t("help_results_count", { count: filteredTerms.length })}
          </Text>
        </View>

        {filteredTerms.map((term, idx) => (
          <View
            key={`${term.abbr}-${idx}`}
            className="bg-surface_container_lowest p-4 rounded-xl border border-outline_variant mb-3"
          >
            <Text className="text-on_surface text-base font-display font-bold mb-1">
              {term.latin}
            </Text>
            <Text className="text-primary font-bold mb-1">{term.abbr}</Text>
            <Text className="text-on_surface_variant">{term.meaning}</Text>
          </View>
        ))}

        {filteredTerms.length === 0 && (
          <View className="bg-surface_container_low p-6 rounded-xl items-center">
            <Text className="text-on_surface_variant text-center">
              {t("help_no_results")}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
