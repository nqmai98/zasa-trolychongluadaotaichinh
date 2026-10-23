import { ShieldAlert, ShieldCheck, TriangleAlert, type LucideIcon } from "lucide-react";
import type { RiskLevel } from "./mock-risk";

/**
 * Nguồn duy nhất cho cách hiển thị một cấp độ cảnh báo: chữ, icon và màu.
 * Mọi nơi hiện mức rủi ro (màn hình Kết quả, lịch sử, trang người thân) đều đọc từ đây.
 */
export type RiskLevelStyle = {
  /** Nhãn in hoa trên băng kết quả */
  label: string;
  /** Nhãn ngắn trong danh sách, lịch sử */
  short: string;
  /** Câu kết luận một dòng dưới nhãn */
  headline: string;
  icon: LucideIcon;
  /** Băng nền đậm */
  banner: string;
  /** Thẻ nền nhạt */
  soft: string;
  /** Màu icon trên nền thẻ */
  iconColor: string;
};

export const RISK_LEVELS: Record<RiskLevel, RiskLevelStyle> = {
  danger: {
    label: "NGUY HIỂM",
    short: "Nguy hiểm",
    headline: "Có dấu hiệu lừa đảo. Dừng lại ngay!",
    icon: ShieldAlert,
    banner: "bg-destructive text-destructive-foreground",
    soft: "border-destructive/40 bg-destructive/10",
    iconColor: "text-destructive",
  },
  warn: {
    label: "CẦN CẢNH GIÁC",
    short: "Cần cảnh giác",
    headline: "Chưa thể khẳng định an toàn. Hãy xác minh trước khi làm theo.",
    icon: TriangleAlert,
    banner: "bg-warning text-warning-foreground",
    soft: "border-warning/50 bg-warning/15",
    iconColor: "text-warning",
  },
  safe: {
    label: "CHƯA THẤY DẤU HIỆU",
    short: "Chưa thấy dấu hiệu",
    headline: "Chưa phát hiện dấu hiệu lừa đảo, nhưng vẫn nên cẩn thận.",
    icon: ShieldCheck,
    banner: "bg-success text-success-foreground",
    soft: "border-success/40 bg-success/10",
    iconColor: "text-success",
  },
};
