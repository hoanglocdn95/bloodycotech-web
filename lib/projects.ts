export type Project = {
  slug: string;
  title: string;
  summary: string;
  releasedAt: string;
  url: string;
  tags: string[];
};

/**
 * Chỉ thêm dự án khi có URL phát hành công khai.
 * Mảng rỗng là trạng thái thật của V1, không phải dữ liệu mẫu.
 */
export const projects: readonly Project[] = [];
