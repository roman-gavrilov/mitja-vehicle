import { createReseller, findUserByEmail } from "../../../../../../models/user";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { uploadLogo } from "../../../../../../utils/upload";

const SHOPIFY_STORE = process.env.SHOPIFY_STORE;
const SHOPIFY_ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_TOKEN;
const JWT_SECRET = process.env.JWT_SECRET;

async function createShopifyCustomer(
  firstName,
  lastName,
  email,
  password,
  companyDetails,
  phone,
  logoUrl
) {
  const response = await fetch(
    `${SHOPIFY_STORE}admin/api/2023-04/customers.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": SHOPIFY_ADMIN_TOKEN,
      },
      body: JSON.stringify({
        customer: {
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password,
          password_confirmation: password,
          send_email_welcome: false,
          phone: phone,
          addresses: [
            {
              address1: companyDetails.street,
              city: companyDetails.city,
              province: "",
              phone: phone,
              zip: companyDetails.zip,
              last_name: lastName,
              first_name: firstName,
              company: companyDetails.companyName,
            },
          ],
          tags: `Reseller, company:${companyDetails.companyName}, logo:${logoUrl}`,
          metafields: [
            {
              key: "vat_number",
              value: companyDetails.vatNumber,
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
    return errorData;
  }

  return response.json();
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const companyName = formData.get("companyName");
    const street = formData.get("street");
    const zip = formData.get("zip");
    const city = formData.get("city");
    const vatNumber = formData.get("vatNumber");
    const email = formData.get("email");
    const password = formData.get("password");
    const phone = formData.get("phone");
    const logo = formData.get("logo");

    // Validate input
    if (
      !firstName ||
      !lastName ||
      !companyName ||
      !email ||
      !password ||
      !street ||
      !zip ||
      !city ||
      !vatNumber ||
      !phone
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Your password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Create customer in Shopify
    const companyDetails = { street, zip, city, vatNumber, companyName };
    const shopifyCustomer = await createShopifyCustomer(
      firstName,
      lastName,
      email,
      password,
      companyDetails,
      phone
    );

    if (shopifyCustomer.errors) {
      return NextResponse.json(
        {
          message: "User creation failed on Shopify side",
          error: shopifyCustomer.errors,
        },
        { status: 400 }
      );
    }

    // Handle logo upload if provided
    let logoUrl = null;
    if (logo) {
      logoUrl = await uploadLogo(logo);
    }

    // Create user in your database
    const newUser = await createReseller({
      firstName,
      lastName,
      companyName,
      email,
      password,
      phone,
      shopify_id: shopifyCustomer.customer.id,
      role: "reseller",
      companyDetails: {
        street,
        zip,
        city,
        vatNumber,
      },
      logoUrl, // Save the logo URL in the user record
    });

    // Automatically log the user in by generating a JWT token
    const token = jwt.sign(
      {
        userId: newUser._id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        companyName: newUser.companyDetails.companyName,
        role: "reseller",
        logoUrl: newUser.companyDetails.logoUrl,
      },
      JWT_SECRET,
      { expiresIn: "5h" }
    );

    // Set the token in a cookie and respond
    const response = NextResponse.json({
      message: "Reseller created and logged in successfully",
    });
    response.cookies.set("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 5,
    });

    return response;
  } catch (error) {
    console.error("Reseller signup error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
