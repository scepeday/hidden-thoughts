const DEFAULT_API_VERSION = "2026-04";

const PRODUCT_PREVIEW_QUERY = `#graphql
  query ProductPreview($first: Int!) {
    products(first: $first) {
      nodes {
        id
        title
        handle
        featuredImage {
          url
          altText
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

function normalizeStoreDomain(domain) {
  return domain?.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function formatPrice(price) {
  if (!price?.amount || !price?.currencyCode) {
    return "";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currencyCode,
  }).format(Number(price.amount));
}

export async function fetchShopifyProductPreviews(limit = 4) {
  const storeDomain = normalizeStoreDomain(import.meta.env.VITE_SHOPIFY_STORE_DOMAIN);
  const storefrontToken = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;
  const apiVersion = import.meta.env.VITE_SHOPIFY_API_VERSION || DEFAULT_API_VERSION;

  if (!storeDomain) {
    throw new Error("Missing VITE_SHOPIFY_STORE_DOMAIN");
  }

  const response = await fetch(`https://${storeDomain}/api/${apiVersion}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(storefrontToken
        ? { "X-Shopify-Storefront-Access-Token": storefrontToken }
        : {}),
    },
    body: JSON.stringify({
      query: PRODUCT_PREVIEW_QUERY,
      variables: { first: limit },
    }),
  });

  if (!response.ok) {
    throw new Error(`Shopify Storefront API returned ${response.status}`);
  }

  const payload = await response.json();

  if (payload.errors?.length) {
    throw new Error(payload.errors[0]?.message || "Shopify Storefront API query failed");
  }

  return payload.data.products.nodes.map((product) => ({
    id: product.id,
    name: product.title,
    label: formatPrice(product.priceRange?.minVariantPrice),
    image: product.featuredImage?.url || "",
    imageAlt: product.featuredImage?.altText || "",
    shopUrl: `https://${storeDomain}/products/${product.handle}`,
  }));
}
