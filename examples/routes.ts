type Route = {
  path: `/${string}`;
  label: string;
};

export const routes = [
  { path: "/blog/", label: "Blog" },
  { path: "/projects/", label: "Dự án" },
] as const satisfies readonly Route[];

export const blogPath = routes[0].path;
