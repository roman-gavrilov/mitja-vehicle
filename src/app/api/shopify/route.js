import { NextResponse } from 'next/server';

export async function POST(req) {
  const { SHOPIFY_STORE, SHOPIFY_ADMIN_TOKEN } = process.env;

  if (!SHOPIFY_STORE || !SHOPIFY_ADMIN_TOKEN) {
    return NextResponse.json({ message: 'Shopify credentials are missing' }, { status: 500 });
  }

  try {
    const data = await req.json();

    // List of keys that should be excluded from tags
    const excludedKeys = ["images", "imagesbase", "price", "loggedInAs"];

    // Create tags from p_data, excluding specified keys
    const tags = Object.entries(data)
      .filter(([key]) => !excludedKeys.includes(key)) // Exclude the specified keys
      .map(([key, value]) => {
        // Ensure it's a string representation for each tag
        if (Array.isArray(value)) {
          return `${key}: ${value.join(", ")}`;
        }
        return `${key}: ${value}`;
      });

    const productData = {
      product: {
        title: `${data.year} ${data.brand} ${data.model}`,
        body_html: ``,
        vendor: data.brand,
        product_type: 'Car',
        tags: tags,
        variants: [
          {
            price: data.price,
            inventory_policy: 'continue', // Allow customers to purchase this product when it's out of stock
            inventory_management: null, // Don't track inventory
            requires_shipping: false, // Set as non-physical product
          },
        ],
        images: data.imagesbase.map(url => ({ attachment: url })),
      },
    };

    const productResponse = await fetch(`${SHOPIFY_STORE}/admin/api/2023-04/products.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN,
      },
      body: JSON.stringify(productData),
    });

    if (!productResponse.ok) {
      const errorText = await productResponse.text();
      throw new Error(`HTTP error! status: ${productResponse.status}, message: ${errorText}`);
    }

    const productResult = await productResponse.json();

    return NextResponse.json({ message: 'Product created successfully', product: productResult.product }, { status: 200 });
  } catch (error) {
    console.error('Error creating Shopify product:', error);
    return NextResponse.json({ message: 'Error creating Shopify product', error: error.message }, { status: 500 });
  }
}