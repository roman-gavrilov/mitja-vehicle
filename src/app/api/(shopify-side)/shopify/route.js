import { NextResponse } from 'next/server';
import { findUserByEmail } from '../../../../../models/user';

export async function POST(req) {
  const { SHOPIFY_STORE, SHOPIFY_ADMIN_TOKEN } = process.env;

  if (!SHOPIFY_STORE || !SHOPIFY_ADMIN_TOKEN) {
    return NextResponse.json({ message: 'Shopify credentials are missing' }, { status: 500 });
  }

  try {
    const data = await req.json();

    // Get user details
    const user = await findUserByEmail(data.userEmail);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Format user data based on role
    let sellerData;
    if (user.role === 'private') {
      sellerData = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      };
    } else {
      // Reseller user
      sellerData = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        companyDetails: user.companyDetails
      };
    }

    // List of keys that should be excluded from metafields
    const excludedKeys = ["images", "imagesbase", "price", "description"];

    // Create metafields array with seller data
    const metafields = [
      // Add seller metafield
      {
        namespace: "seller_details",
        key: "seller",
        value: JSON.stringify(sellerData),
        type: "json_string"
      },
      // Add other metafields
      ...Object.entries(data)
        .filter(([key]) => !excludedKeys.includes(key))
        .flatMap(([key, value]) => {
          if (key === "features") {
            // Handle features object - store all features as a single JSON metafield
            return [{
              namespace: "vehicle_features",
              key: "all_features",
              value: JSON.stringify(value),
              type: "json_string"
            }];
          }
          
          // Handle array values
          if (Array.isArray(value)) {
            return [{
              namespace: "vehicle_details",
              key: key.toLowerCase().replace(/\s+/g, '_'),
              value: value.join(", "),
              type: "single_line_text_field"
            }];
          }

          // For all other keys
          return [{
            namespace: "vehicle_details",
            key: key.toLowerCase().replace(/\s+/g, '_'),
            value: String(value),
            type: "single_line_text_field"
          }];
        }),
    ];

    const productData = {
      product: {
        title: `${data.year} ${data.brand} ${data.model}`,
        body_html: data.description,
        vendor: data.brand,
        product_type: 'Car',
        tags: 'Sell',
        metafields: metafields,
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

    // Get user details for PUT request
    const user = await findUserByEmail(data.userEmail);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Format user data based on role
    let sellerData;
    if (user.role === 'private') {
      sellerData = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      };
    } else {
      // Reseller user
      sellerData = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        companyDetails: user.companyDetails
      };
    }

    // List of keys that should be excluded from metafields
    const excludedKeys = ["images", "imagesbase", "price", "shopifyproduct"];

    // Create metafields array with seller data
    const metafields = [
      // Add seller metafield
      {
        namespace: "seller_details",
        key: "seller",
        value: JSON.stringify(sellerData),
        type: "json_string"
      },
      // Add other metafields
      ...Object.entries(data)
        .filter(([key]) => !excludedKeys.includes(key))
        .flatMap(([key, value]) => {
          if (key === "features") {
            // Handle features object - store all features as a single JSON metafield
            return [{
              namespace: "vehicle_features",
              key: "all_features",
              value: JSON.stringify(value),
              type: "json_string"
            }];
          }
          
          // Handle array values
          if (Array.isArray(value)) {
            return [{
              namespace: "vehicle_details",
              key: key.toLowerCase().replace(/\s+/g, '_'),
              value: value.join(", "),
              type: "single_line_text_field"
            }];
          }

          // For all other keys
          return [{
            namespace: "vehicle_details",
            key: key.toLowerCase().replace(/\s+/g, '_'),
            value: String(value),
            type: "single_line_text_field"
          }];
        }),
    ];

    const productData = {
      product: {
        id: productId,
        title: `${data.year} ${data.brand} ${data.model}`,
        body_html: data.description,
        vendor: data.brand,
        product_type: 'Car',
        tags: 'Sell',
        metafields: metafields,
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