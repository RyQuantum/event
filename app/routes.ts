import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // index("routes/home.tsx", { id: 'home' }),
  index("routes/index.tsx"),
  route(":eventId","routes/home.tsx"),
  route("submitted", "routes/submitted.tsx"),
  // route("*", "routes/invalid.tsx"),
] satisfies RouteConfig;
