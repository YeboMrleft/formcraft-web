import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const APP_URL = 'https://formcraft-web.vercel.app';
const NOTIFY_URL = 'https://formcraft-ai-39547.web.app/payfast/notify';

export async function POST(req: NextRequest) {
  try {
    const { plan, documentId, documentName, buyerName, buyerEmail } = await req.json();

    const merchantId  = process.env.PAYFAST_MERCHANT_ID;
    const merchantKey = process.env.PAYFAST_MERCHANT_KEY;
    const passphrase  = process.env.PAYFAST_PASSPHRASE;

    if (!merchantId || !merchantKey) {
      return NextResponse.json({ error: 'PayFast not configured' }, { status: 500 });
    }

    const isSubscription = plan === 'unlimited' || plan === 'business';
    const amount = isSubscription ? (plan === 'student' ? '35.00' : '99.00') : '50.00';
    const mPaymentId = `FCW-${documentId}-${Date.now()}`;

    const params: Record<string, string> = {
      merchant_id:      merchantId,
      merchant_key:     merchantKey,
      return_url:       `${APP_URL}/payment/success?pid=${mPaymentId}&plan=${plan}`,
      cancel_url:       `${APP_URL}/payment/cancel`,
      notify_url:       NOTIFY_URL,
      name_first:       buyerName.split(' ')[0] || 'Customer',
      name_last:        buyerName.split(' ').slice(1).join(' ') || 'User',
      email_address:    buyerEmail,
      m_payment_id:     mPaymentId,
      amount:           amount,
      item_name:        isSubscription
                          ? `FormCraft AI — ${plan === 'student' ? 'Student' : 'Business'} Plan`
                          : `FormCraft AI — ${documentName}`,
      item_description: isSubscription
                          ? `Unlimited document exports. Billed monthly.`
                          : `Once-off export: ${documentName}`,
      custom_str1:      plan,
      custom_str2:      documentId,
    };

    if (isSubscription) {
      params.subscription_type = '1';
      params.billing_date      = new Date().toISOString().split('T')[0];
      params.recurring_amount  = amount;
      params.frequency         = '3';
      params.cycles            = '0';
    }

    const queryString = Object.keys(params)
      .filter(k => params[k] !== '' && params[k] != null)
      .map(k => `${k}=${encodeURIComponent(params[k]).replace(/%20/g, '+')}`)
      .join('&');

    const stringToHash = passphrase
      ? `${queryString}&passphrase=${encodeURIComponent(passphrase).replace(/%20/g, '+')}`
      : queryString;

    params.signature = crypto.createHash('md5').update(stringToHash).digest('hex');

    const finalQuery = Object.keys(params)
      .map(k => `${k}=${encodeURIComponent(params[k]).replace(/%20/g, '+')}`)
      .join('&');

    return NextResponse.json({ url: `https://www.payfast.co.za/eng/process?${finalQuery}` });
  } catch (error) {
    console.error('PayFast URL error:', error);
    return NextResponse.json({ error: 'Could not generate payment URL' }, { status: 500 });
  }
}
