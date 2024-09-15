// $5.5 => $5.50
// $10 => $10
function formatPrice(price: number) {
  if (price - Math.floor(price) > 0) return price.toFixed(2);
  return price;
}

function attachUserInfo(
  url: string,
  user: { id: string; email: string; name?: string | null },
) {
  if (!user) return url;

  return `${url}?checkout[custom][user_id]=${user.id}&checkout[email]=${user.email}&checkout[name]=${user.name}`;
}

function buildLemonUrl(url: string, affiliateCode?: string | null) {
  if (!affiliateCode) return url;
  const newUrl = `${url}?aff_ref=${affiliateCode}`;
  return newUrl;
}
