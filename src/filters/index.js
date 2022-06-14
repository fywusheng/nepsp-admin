import { parseTime } from "@/utils/index"
export function parseTimeFilter(val, format) {
  return parseTime(val, format)
}
export { dayFormat } from "@/utils/dayjs"