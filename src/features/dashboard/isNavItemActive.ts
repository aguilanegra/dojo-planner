export const isNavItemActive = (pathname: string, locale: string, url: string) => {
  const pathWithoutLocale = pathname.startsWith(`/${locale}`) ? pathname.slice(`/${locale}`.length) : pathname;

  // Exact match
  if (pathWithoutLocale === url) {
    return true;
  }

  // Sub-route matching: match child routes but not for top-level /dashboard
  // e.g., /dashboard/members/123/edit matches /dashboard/members
  // but /dashboard/members/123/edit does NOT match /dashboard
  if (url !== '/dashboard' && pathWithoutLocale.startsWith(`${url}/`)) {
    return true;
  }

  return false;
};
