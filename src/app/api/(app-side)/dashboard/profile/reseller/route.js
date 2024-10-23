import { findUserByEmail, updateUser } from "../../../../../../../models/user";
import { NextResponse } from "next/server";
import { uploadLogo } from '../../../../../../../utils/upload';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const SHOPIFY_STORE = process.env.SHOPIFY_STORE;
const SHOPIFY_ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;

async function updateShopifyCustomer(shopifyId, data, logoUrl) {
  const response = await fetch(
    `${SHOPIFY_STORE}admin/api/2023-04/customers/${shopifyId}.json`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": SHOPIFY_ADMIN_TOKEN,
      },
      body: JSON.stringify({
        customer: {
          id: shopifyId,
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: data.companyDetails.phone,
          addresses: [
            {
              address1: data.companyDetails.street,
              city: data.companyDetails.city,
              province: "",
              phone: data.companyDetails.phone,
              zip: data.companyDetails.zip,
              last_name: data.lastName,
              first_name: data.firstName,
              company: data.companyDetails.companyName,
            },
          ],
          tags: `Reseller, company:${data.companyDetails.companyName}${logoUrl ? `, logo:${logoUrl}` : ''}`,
          metafields: [
            {
              key: "vat_number",
              value: data.companyDetails.vatNumber,
              type: "single_line_text_field",
              namespace: "custom",
            },
          ],
        },
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(JSON.stringify(errorData));
  }

  return response.json();
}

export async function POST(request) {
  try {
    // Get the token from the cookies
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify the token
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Find user
    const user = await findUserByEmail(decodedToken.email);
    if (!user || user.role !== 'reseller') {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const formData = await request.formData();
    
    // Parse working hours and additional contact details
    const workingHours = JSON.parse(formData.get("companyDetails.workingHours"));
    const additionalPhones = JSON.parse(formData.get("companyDetails.additionalPhones"));
    const additionalEmails = JSON.parse(formData.get("companyDetails.additionalEmails"));

    // Basic user data
    const updateData = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      companyDetails: {
        companyName: formData.get("companyDetails.companyName"),
        street: formData.get("companyDetails.street"),
        city: formData.get("companyDetails.city"),
        zip: formData.get("companyDetails.zip"),
        vatNumber: formData.get("companyDetails.vatNumber"),
        phone: formData.get("companyDetails.phone"),
        workingHours,
        additionalPhones,
        additionalEmails
      }
    };

    // Handle logo upload if provided
    const logo = formData.get("companyDetails.logo");
    if (logo && logo instanceof Blob) {
      const logoUrl = await uploadLogo(logo);
      updateData.companyDetails.logoUrl = logoUrl;
    }

    // Update in Shopify
    try {
      await updateShopifyCustomer(
        user.shopify_id,
        updateData,
        updateData.companyDetails.logoUrl
      );
    } catch (error) {
      console.error("Shopify update error:", error);
      return NextResponse.json(
        { error: "Failed to update profile in Shopify" },
        { status: 500 }
      );
    }

    // Update in database
    const updatedUser = await updateUser(user.email, updateData);

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Failed to update profile" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        companyDetails: updatedUser.companyDetails
      }
    });

  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}