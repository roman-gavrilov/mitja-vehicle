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

export async function PUT(req) {
  const { SHOPIFY_STORE, SHOPIFY_ADMIN_TOKEN } = process.env;

  if (!SHOPIFY_STORE || !SHOPIFY_ADMIN_TOKEN) {
    return NextResponse.json({ message: 'Shopify credentials are missing' }, { status: 500 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productid');

    if (!productId) {
      return NextResponse.json({ message: 'Product ID is missing' }, { status: 400 });
    }

    const data = await req.json();

    // List of keys that should be excluded from tags
    const excludedKeys = ["images", "imagesbase", "price", "loggedInAs", "shopifyproduct"];

    // Create tags from data, excluding specified keys
    const tags = Object.entries(data)
      .filter(([key]) => !excludedKeys.includes(key))
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key}: ${value.join(", ")}`;
        }
        return `${key}: ${value}`;
      });

    const productData = {
      product: {
        id: productId,
        title: `${data.year} ${data.brand} ${data.model}`,
        body_html: `<p>Year: ${data.year}</p><p>Brand: ${data.brand}</p><p>Model: ${data.model}</p><p>Mileage: ${data.mileage}</p><p>Fuel Type: ${data.fuelType}</p><p>Power: ${data.power} ${data.powerUnit}</p>`,
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
      },
    };

    const productResponse = await fetch(`${SHOPIFY_STORE}/admin/api/2023-04/products/${productId}.json`, {
      method: 'PUT',
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

    return NextResponse.json({ message: 'Product updated successfully', product: productResult.product }, { status: 200 });
  } catch (error) {
    console.error('Error updating Shopify product:', error);
    return NextResponse.json({ message: 'Error updating Shopify product', error: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  const { SHOPIFY_STORE, SHOPIFY_ADMIN_TOKEN } = process.env;

  if (!SHOPIFY_STORE || !SHOPIFY_ADMIN_TOKEN) {
    return NextResponse.json({ message: 'Shopify credentials are missing' }, { status: 500 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productid');

    if (!productId) {
      return NextResponse.json({ message: 'Product ID is missing' }, { status: 400 });
    }

    const deleteResponse = await fetch(`${SHOPIFY_STORE}/admin/api/2023-04/products/${productId}.json`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ADMIN_TOKEN,
      },
    });

    if (!deleteResponse.ok) {
      const errorText = await deleteResponse.text();
      throw new Error(`HTTP error! status: ${deleteResponse.status}, message: ${errorText}`);
    }

    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting Shopify product:', error);
    return NextResponse.json({ message: 'Error deleting Shopify product', error: error.message }, { status: 500 });
  }
}