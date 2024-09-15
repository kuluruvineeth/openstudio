// $5.5 => $5.50
// $10 => $10
function formatPrice(price: number) {
  if (price - Math.floor(price) > 0) return price.toFixed(2);
  return price;
}
