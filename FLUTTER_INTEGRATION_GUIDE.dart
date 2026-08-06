// ═══════════════════════════════════════════════════════════════════════════════
// MERISHOP APP — Flutter WhatsApp Notification Integration Guide
// API Endpoint: https://www.aroventech.site/api/merishop-notify
// ═══════════════════════════════════════════════════════════════════════════════
//
// Ye code Flutter/Dart app mein add karo.
// Har shopkeeper ke liye ek shopId hota hai (e.g. MSCHAUBEYSHOP01)
// Usi ke based par sahi shop name, UPI, aur online link customer ko jayega.
//
// ─── Setup ────────────────────────────────────────────────────────────────────

import 'dart:convert';
import 'package:http/http.dart' as http;

const String _notifyApiUrl = 'https://www.aroventech.site/api/merishop-notify';

// ─── MeriShop Notify Service ──────────────────────────────────────────────────
class MeriShopNotifyService {
  
  // ── 1. Bill / GST Invoice WhatsApp (Bill ban'ne ke turant baad call karo) ──
  static Future<bool> sendBillWhatsApp({
    required String shopId,          // Your shop ID e.g. 'MSCHAUBEYSHOP01'
    required String shopName,        // e.g. 'Chaubey General Store'
    required String customerPhone,   // 10-digit customer number
    required String amount,          // Total bill amount e.g. '485'
    String? shopUpiId,               // e.g. 'chaubey@upi'
    String? customerName,
    String? billNo,
    String? gstAmount,
    String? discount,
    String? paymentMode,             // 'Cash', 'UPI', 'Card'
    List<Map<String, dynamic>>? items, // [{'name':'Fortune Oil', 'qty':1, 'price':145}]
  }) async {
    try {
      final response = await http.post(
        Uri.parse(_notifyApiUrl),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'action': 'send_bill',
          'shopId': shopId,
          'shopName': shopName,
          'shopUpiId': shopUpiId,
          'customerPhone': customerPhone,
          'customerName': customerName,
          'billNo': billNo,
          'amount': amount,
          'gstAmount': gstAmount,
          'discount': discount,
          'paymentMode': paymentMode,
          'items': items ?? [],
        }),
      );
      final data = jsonDecode(response.body);
      print('✅ Bill WhatsApp: ${data['whatsappSent']} → $customerPhone');
      return data['success'] == true;
    } catch (e) {
      print('❌ Bill WhatsApp Error: $e');
      return false;
    }
  }

  // ── 2. Udhaar/Payment Reminder WhatsApp ──────────────────────────────────
  static Future<bool> sendUdhaarReminder({
    required String shopId,
    required String shopName,
    required String customerPhone,
    required String balance,         // Pending amount e.g. '750'
    String? shopUpiId,
    String? customerName,
    int? daysOverdue,                // How many days overdue
  }) async {
    try {
      final response = await http.post(
        Uri.parse(_notifyApiUrl),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'action': 'send_udhaar_reminder',
          'shopId': shopId,
          'shopName': shopName,
          'shopUpiId': shopUpiId,
          'customerPhone': customerPhone,
          'customerName': customerName,
          'balance': balance,
          'daysOverdue': daysOverdue,
        }),
      );
      final data = jsonDecode(response.body);
      print('✅ Udhaar Reminder: ${data['whatsappSent']} → $customerPhone');
      return data['success'] == true;
    } catch (e) {
      print('❌ Udhaar Reminder Error: $e');
      return false;
    }
  }

  // ── 3. Shop Online Link WhatsApp (customer ko apni shop ka link bhejo) ──
  static Future<bool> sendShopLink({
    required String shopId,
    required String shopName,
    required String customerPhone,
    String? customerName,
    String? customMessage,
  }) async {
    try {
      final response = await http.post(
        Uri.parse(_notifyApiUrl),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'action': 'send_shop_link',
          'shopId': shopId,
          'shopName': shopName,
          'customerPhone': customerPhone,
          'customerName': customerName,
          'customMessage': customMessage,
        }),
      );
      final data = jsonDecode(response.body);
      print('✅ Shop Link Sent: ${data['whatsappSent']} → $customerPhone');
      return data['success'] == true;
    } catch (e) {
      print('❌ Shop Link Error: $e');
      return false;
    }
  }

  // ── 4. Offer/Promo WhatsApp (sale, festive offer, new stock) ─────────────
  static Future<bool> sendOffer({
    required String shopId,
    required String shopName,
    required String customerPhone,
    String? customerName,
    String? offerTitle,
    String? offerDetails,
    String? discountPercent,
    String? validTill,
  }) async {
    try {
      final response = await http.post(
        Uri.parse(_notifyApiUrl),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'action': 'send_offer',
          'shopId': shopId,
          'shopName': shopName,
          'customerPhone': customerPhone,
          'customerName': customerName,
          'offerTitle': offerTitle,
          'offerDetails': offerDetails,
          'discountPercent': discountPercent,
          'validTill': validTill,
        }),
      );
      final data = jsonDecode(response.body);
      return data['success'] == true;
    } catch (e) {
      print('❌ Offer Send Error: $e');
      return false;
    }
  }
}


// ═══════════════════════════════════════════════════════════════════════════════
// HOW TO USE — Apne MeriShop Flutter App mein Integration Examples
// ═══════════════════════════════════════════════════════════════════════════════

// ── EXAMPLE 1: Bill banega → Customer ko instant WhatsApp ─────────────────────
// Apne billing screen ke "Create Bill" button ke after lagao:
/*
void onBillCreated(Bill bill, Customer customer, Shop currentShop) async {
  await MeriShopNotifyService.sendBillWhatsApp(
    shopId: currentShop.shopId,          // App ke logged-in shop ka ID
    shopName: currentShop.name,          // App ke logged-in shop ka naam
    shopUpiId: currentShop.upiId,        // Shop ka UPI ID
    customerPhone: customer.phone,       // Customer ka number
    customerName: customer.name,
    billNo: bill.billNumber,
    amount: bill.totalAmount.toString(),
    gstAmount: bill.gstAmount?.toString(),
    paymentMode: bill.paymentMethod,     // 'Cash', 'UPI', 'Card'
    items: bill.items.map((item) => {
      'name': item.name,
      'qty': item.quantity,
      'price': item.totalPrice,
    }).toList(),
  );
}
*/

// ── EXAMPLE 2: Udhaar Reminder — Automatic (App already does this every 5 days)
/*
void sendUdhaarRemindersForShop(Shop shop, List<UdhaarEntry> pending) async {
  for (var entry in pending) {
    if (entry.customer.phone != null) {
      await MeriShopNotifyService.sendUdhaarReminder(
        shopId: shop.shopId,
        shopName: shop.name,
        shopUpiId: shop.upiId,
        customerPhone: entry.customer.phone!,
        customerName: entry.customer.name,
        balance: entry.balance.toString(),
        daysOverdue: entry.daysSinceLastPayment,
      );
      await Future.delayed(Duration(milliseconds: 300)); // Rate limit
    }
  }
}
*/

// ── EXAMPLE 3: Shop Online Link — Customer ke WhatsApp par bhejo ──────────────
/*
void onShareShopLink(Customer customer, Shop shop) async {
  await MeriShopNotifyService.sendShopLink(
    shopId: shop.shopId,
    shopName: shop.name,
    customerPhone: customer.phone,
    customerName: customer.name,
  );
}
*/

// ─── Shop ID Mapping (Add all 50 shops here) ─────────────────────────────────
// Har shopkeeper ka ek unique shop ID hota hai jo MeriShop app mein set hai
// Online store URL: https://www.aroventech.site/merishop/{shopId}
//
// Shop ID list (50 shops):
// MSCHAUBEYSHOP01 → Chaubey General Store → aroventech.site/merishop/MSCHAUBEYSHOP01
// MSGUPTA001      → Gupta Medical Store    → aroventech.site/merishop/MSGUPTA001
// ... add more as shops onboard
