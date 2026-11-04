export const categories = {
  react: {
    label: "React",
    description: "Giao diện, framework và dữ liệu trên React.",
  },
  typescript: {
    label: "TypeScript",
    description: "Kiểu cho component, state và cấu hình.",
  },
  "ha-tang": {
    label: "Hạ tầng",
    description: "Xuất bản website tĩnh và những giới hạn đi kèm.",
  },
  "web-game": {
    label: "Web game",
    description: "Âm thanh, lưu game và điều khiển trên nhiều loại màn hình.",
  },
} as const;

export type CategorySlug = keyof typeof categories;

export function isCategorySlug(value: string): value is CategorySlug {
  return Object.prototype.hasOwnProperty.call(categories, value);
}
