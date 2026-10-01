export function eventPublicPath(slug: string) {
  return `/whats-on/${slug}`;
}

export function siteOrigin() {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

export function absoluteUrl(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteOrigin()}${normalized}`;
}

export function eventShareUrl(slug: string) {
  return absoluteUrl(eventPublicPath(slug));
}

export function shareMessage(title: string, schedule?: string) {
  const bits = [title, "at Blue Top Villa, Kasoa"];
  if (schedule) bits.push(schedule);
  return bits.join(" · ");
}

export function whatsAppShareUrl(url: string, message?: string) {
  const text = message ? `${message}\n\n${url}` : url;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

export function facebookShareUrl(url: string) {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
}

export function twitterShareUrl(url: string, text?: string) {
  const params = new URLSearchParams({ url });
  if (text) params.set("text", text);
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}
