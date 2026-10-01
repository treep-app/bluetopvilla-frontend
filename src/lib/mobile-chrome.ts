/** Routes where the mobile bottom bar is hidden (focused flows / full-viewport pages). */
const HIDE_MOBILE_NAV_EXACT = ["/book", "/rooms"];
const HIDE_MOBILE_NAV_PREFIX = ["/book/"];

export function showMobileBottomNav(pathname: string) {
  if (HIDE_MOBILE_NAV_EXACT.includes(pathname)) return false;
  if (HIDE_MOBILE_NAV_PREFIX.some((p) => pathname === p || pathname.startsWith(p))) return false;
  return true;
}
