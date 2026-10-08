import dayjs from "@calcom/dayjs";

const MONTH_FORMAT = "YYYY-MM";
const DATE_FORMAT = "YYYY-MM-DD";

type BookerQueryParams = {
  month: string;
  date: string | null;
};

const parseStrict = (value: string | null | undefined, format: string): ReturnType<typeof dayjs> | null => {
  if (!value) return null;

  const parsed = dayjs(value, format, true);
  if (!parsed.isValid()) return null;
  return parsed;
};

export const normalizeBookerQueryParams = ({
  month,
  date,
}: {
  month?: string | null;
  date?: string | null;
}): BookerQueryParams => {
  const validDate = parseStrict(date, DATE_FORMAT);
  const validMonth = parseStrict(month, MONTH_FORMAT);

  return {
    date: validDate?.format(DATE_FORMAT) ?? null,
    month:
      validMonth?.format(MONTH_FORMAT) ?? validDate?.format(MONTH_FORMAT) ?? dayjs().format(MONTH_FORMAT),
  };
};
