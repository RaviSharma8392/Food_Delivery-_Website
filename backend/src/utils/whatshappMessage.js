import nodemailer from "nodemailer";
import { EMAIL, EMAILPaSS, ADMINEMAIL } from "../config/index.js";
import FoodItem from "../models/FoodItem.js";
import User from "../models/User.js";

// Email setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL,
    pass: EMAILPaSS,
  },
});

const sendEmailNotification = async (order) => {
  try {
    const {
      userId,
      name: guestName,
      phone: guestPhone,
      email: guestEmail,
      address,
      method,
      subtotal,
      deliveryFee,
      totalAmount,promoCode,
      items,
    } = order;

    // 🔄 Get user info (if logged in)
    let name = guestName || "Guest";
    let phoneNumber = guestPhone || "N/A";
    let email = guestEmail || "N/A";

    if (userId) {
      const userInfo = await User.findById(userId);
      if (userInfo) {
        name = userInfo.name;
        phoneNumber = userInfo.phoneNumber;
        email = userInfo.email || email;
      }
    }

    // Fetch item details
    const itemDetails = await Promise.all(
      items.map(async (item) => {
        const food = await FoodItem.findById(item.itemId);
        return {
          name: food?.name || "Unknown Item",
          imageUrl: food?.imageUrl || "",
          portion: item.portion,
          quantity: item.quantity,
        };
      })
    );

    // Plain text fallback
    const plainText = `
New Order Received

Customer:
Name: ${name}
Phone: ${phoneNumber}
Email: ${email}
Address: ${address}
Payment Method: ${method}
Promo code:${promoCode}

Items:
${itemDetails.map((item) => `- ${item.name} (${item.portion}) x${item.quantity}`).join("\n")}

Subtotal: ₹${subtotal}
Delivery Fee: ₹${deliveryFee}
Total: ₹${totalAmount}
`;

    // HTML email content
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; line-height: 1.5; max-width: 600px; margin: auto;">
        <h2 style="color: #333;">📦 New Order Alert</h2>

        <h3>👤 Customer Info</h3>
        <p><strong>Name:</strong> ${name}<br/>
           <strong>Phone:</strong> ${phoneNumber}<br/>
           <strong>Email:</strong> ${email}<br/>
           <strong>Address:</strong> ${address}<br/>
           <strong>Payment Method:</strong> ${method}</p>
             <strong>Promo code:</strong>${promoCode}</p>

        <h3>🛒 Order Items</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="border-bottom: 1px solid #ddd;">Image</th>
              <th style="border-bottom: 1px solid #ddd;">Item</th>
              <th style="border-bottom: 1px solid #ddd;">Portion</th>
              <th style="border-bottom: 1px solid #ddd;">Qty</th>
            </tr>
          </thead>
          <tbody>
            ${itemDetails
              .map(
                (item) => `
              <tr>
                <td style="padding: 8px;"><img src="${item.imageUrl}" alt="${item.name}" style="width: 60px; border-radius: 8px;" /></td>
                <td style="padding: 8px;">${item.name}</td>
                <td style="padding: 8px;">${item.portion}</td>
                <td style="padding: 8px;">${item.quantity}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>

        <h3>💰 Billing</h3>
        <p>
          <strong>Subtotal:</strong> ₹${subtotal}<br/>
          <strong>Delivery Fee:</strong> ₹${deliveryFee}<br/>
          <strong>Total:</strong> ₹${totalAmount}
        </p>

        <p style="color: #777;">🕒 ${new Date().toLocaleString()}</p>
      </div>
    `;

    // Send email
    const info = await transporter.sendMail({
      from: `"Food Order Paid" <${EMAIL}>`,
      to: ADMINEMAIL, // Admin email
      subject: "📦 New Order Received!",
      text: plainText,
      html: htmlContent,
    });

    console.log("✅ Email sent:", info.messageId);
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
  }
};

export default sendEmailNotification;
