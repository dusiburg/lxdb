"use client";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/components/ui/native-select"
import { Input } from "@/components/ui/input"
import { useTranslations } from "next-intl";
import { DatePicker } from "./DatePicker";

export function FilterPanel({ title, setTitle, date, setDate, country, setCountry }: { title: string; setTitle: (title: string) => void; date: Date | undefined; setDate: (date: Date | undefined) => void; country: string; setCountry: (country: string) => void; }) {
  const t = useTranslations("");

  return (
    <FieldSet className="w-full">
      <FieldGroup className="flex md:flex-row gap-4">
        <Field>
          <FieldLabel htmlFor="title">{t("filter.title.name")}</FieldLabel>
          <Input id="title" type="text" placeholder={t("filter.title.placeholder")} onChange={(e) => setTitle(e.target.value)} value={title} />
          <FieldDescription>
            {t("filter.title.description")}
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="date">{t("filter.date.name")}</FieldLabel>
          <DatePicker date={date} setDate={setDate} />
          <FieldDescription>
            {t("filter.date.description")}
          </FieldDescription>
        </Field>
        <Field>
          <FieldLabel htmlFor="country">{t("filter.country.name")}</FieldLabel>
            <NativeSelect value={country} onChange={(e) => setCountry(e.target.value)}>
              <NativeSelectOption value="all">{t("countries.all")}</NativeSelectOption>
              <NativeSelectOption value="du">{t("countries.du")}</NativeSelectOption>
              <NativeSelectOption value="cr">{t("countries.cr")}</NativeSelectOption>
            </NativeSelect>
          <FieldDescription>
            {t("filter.country.description")}
          </FieldDescription>
        </Field>
      </FieldGroup>
    </FieldSet>
  )
}