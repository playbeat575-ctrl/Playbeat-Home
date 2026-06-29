'use client'

import * as React from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { FileText, ShieldCheck, RotateCcw, Key } from 'lucide-react'

export type LegalDoc = 'terms' | 'privacy' | 'refund' | 'license'

const META: Record<LegalDoc, { title: string; icon: any; updated: string; description: string }> = {
  terms: { title: 'Terms & Conditions', icon: FileText, updated: 'June 29, 2026', description: 'The terms that govern your use of PlayBeat Digital.' },
  privacy: { title: 'Privacy Policy', icon: ShieldCheck, updated: 'June 29, 2026', description: 'How we collect, use and protect your data.' },
  refund: { title: 'Refund Policy', icon: RotateCcw, updated: 'June 29, 2026', description: 'Our refund and cancellation terms for digital products.' },
  license: { title: 'License Agreement', icon: Key, updated: 'June 29, 2026', description: 'Licensing terms for digital products and license keys.' },
}

export function LegalDialog({ doc, open, onOpenChange }: { doc: LegalDoc; open: boolean; onOpenChange: (v: boolean) => void }) {
  const meta = META[doc]
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] w-full max-w-3xl overflow-hidden p-0">
        <DialogHeader className="border-b bg-gradient-to-r from-deep-navy via-space-black to-deep-navy px-6 py-5">
          <DialogTitle className="flex items-center gap-2.5 text-platinum">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-electric/20">
              <meta.icon className="h-5 w-5 text-cyan-glow" />
            </span>
            {meta.title}
          </DialogTitle>
          <DialogDescription className="text-steel/70">{meta.description}</DialogDescription>
          <div className="mt-1 flex items-center gap-2">
            <Badge variant="outline" className="border-steel/20 text-[10px] text-steel/60">Last updated: {meta.updated}</Badge>
            <Badge variant="outline" className="border-electric/30 text-[10px] text-cyan-glow">PlayBeat Digital</Badge>
          </div>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          <div className="prose prose-invert max-w-none px-6 py-5 text-sm leading-relaxed text-steel">
            {doc === 'terms' && <TermsContent />}
            {doc === 'privacy' && <PrivacyContent />}
            {doc === 'refund' && <RefundContent />}
            {doc === 'license' && <LicenseContent />}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

function H({ children }: { children: React.ReactNode }) {
  return <h3 className="mt-6 mb-2 text-base font-bold text-platinum">{children}</h3>
}
function P({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 text-steel/80">{children}</p>
}
function LI({ children }: { children: React.ReactNode }) {
  return <li className="mb-1.5 text-steel/80">{children}</li>
}

function TermsContent() {
  return (
    <div>
      <P>Welcome to <strong className="text-platinum">PlayBeat Digital</strong> ("we", "us", "our"). These Terms &amp; Conditions ("Terms") govern your access to and use of the PlayBeat Digital website, marketplace, and services (the "Service"). By accessing or purchasing from our marketplace, you agree to be bound by these Terms.</P>

      <H>1. Definitions</H>
      <ul className="ml-4 list-disc">
        <LI><strong>Marketplace</strong> — our platform at playbeat.digital where digital products are listed and sold.</LI>
        <LI><strong>Digital Products</strong> — software, plugins, templates, themes, ebooks, courses, audio, video, graphics, license keys, and other intangible goods delivered electronically.</LI>
        <LI><strong>License Key</strong> — a unique activation code granting access to or usage rights of a digital product.</LI>
        <LI><strong>Subscription</strong> — a recurring monthly or yearly digital product access plan.</LI>
        <LI><strong>Lemon Squeezy</strong> — our payment service provider (Merchant of Record) that processes all checkout transactions.</LI>
      </ul>

      <H>2. Eligibility &amp; Account</H>
      <P>You must be at least 18 years old (or the age of majority in your jurisdiction) to make purchases. By creating an account or checking out, you represent that the information you provide is accurate and complete. You are responsible for maintaining the confidentiality of your account and license keys.</P>

      <H>3. Digital Products &amp; Delivery</H>
      <P>All products on PlayBeat Digital are delivered electronically. Upon successful payment, you will receive:</P>
      <ul className="ml-4 list-disc">
        <LI>An instant download link (where applicable) via email and on-screen.</LI>
        <LI>A license key (where applicable) for product activation.</LI>
        <LI>Subscription access (where applicable) for the duration of the billing period.</LI>
      </ul>
      <P>Due to the digital nature of our products, no physical shipping is involved. Delivery is considered complete once the download link or license key is made available to you.</P>

      <H>4. Pricing &amp; Currency</H>
      <P>Prices are listed in both Pakistani Rupee (PKR) and US Dollar (USD) for display convenience. The base currency for all transactions is USD. Payments are processed by Lemon Squeezy in USD. PKR prices are converted at a reference exchange rate and may differ slightly from your card issuer's rate at the time of charge. Taxes (including VAT) are applied at checkout as required by your jurisdiction and are collected by Lemon Squeezy as Merchant of Record.</P>

      <H>5. Payment &amp; Checkout</H>
      <P>All payments are processed securely by <strong>Lemon Squeezy</strong>, our Merchant of Record. We do not store your credit card or payment details. Supported payment methods include credit/debit cards, Apple Pay, Google Pay, and PayPal, subject to availability in your region. By completing a purchase, you authorize Lemon Squeezy to charge the displayed total to your chosen payment method.</P>

      <H>6. Subscriptions &amp; Renewals</H>
      <P>For subscription products, your plan automatically renews at the end of each billing cycle (monthly or yearly) until cancelled. You may cancel your subscription at any time from your customer portal or by contacting support. Cancellation stops future renewals but does not refund the current billing period. Subscription prices are locked at the time of your initial purchase; we reserve the right to change prices for new subscribers.</P>

      <H>7. License Keys</H>
      <P>License keys are issued for your personal or organizational use as specified by the individual product license. Sharing, reselling, redistributing, or reverse-engineering license keys is strictly prohibited. Misuse of a license key may result in immediate revocation without refund. Each product page specifies the license scope (personal, team, or commercial).</P>

      <H>8. Refunds</H>
      <P>Due to the instant, non-revocable nature of digital products, all sales are generally final. However, we offer refunds in specific circumstances — see our <strong>Refund Policy</strong> for full details. Approved refunds are processed by Lemon Squeezy and typically appear on your statement within 5–10 business days.</P>

      <H>9. Prohibited Conduct</H>
      <P>You agree not to:</P>
      <ul className="ml-4 list-disc">
        <LI>Resell, redistribute, or sublicense digital products unless expressly permitted by the product license.</LI>
        <LI>Share or publish license keys publicly.</LI>
        <LI>Attempt to reverse-engineer, decompile, or extract source code from protected products.</LI>
        <LI>Use the Service for any unlawful, fraudulent, or abusive purpose.</LI>
        <LI>Interfere with or disrupt the Service's servers, security, or operation.</LI>
      </ul>

      <H>10. Intellectual Property</H>
      <P>All digital products remain the intellectual property of their respective creators or PlayBeat Digital. Purchasing a product grants you a license to use it — not ownership of the underlying intellectual property. The PlayBeat Digital name, logo, and website design are our trademarks and may not be used without written permission.</P>

      <H>11. Disclaimer of Warranties</H>
      <P>Digital products are provided "as is" and "as available" without warranties of any kind, express or implied. We do not guarantee that any product will be error-free, uninterrupted, or compatible with your system. You are responsible for verifying product compatibility before purchase.</P>

      <H>12. Limitation of Liability</H>
      <P>To the maximum extent permitted by law, PlayBeat Digital and its suppliers shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or data, arising from your use of or inability to use the Service or any purchased product. Our total liability shall not exceed the amount you paid for the product giving rise to the claim.</P>

      <H>13. Third-Party Services</H>
      <P>The Service integrates with third-party providers including Lemon Squeezy (payments), Neon (database hosting), and others. We are not responsible for the practices or availability of these third parties. Their respective terms and privacy policies apply.</P>

      <H>14. Changes to These Terms</H>
      <P>We may update these Terms from time to time. The "Last updated" date at the top reflects the most recent revision. Continued use of the Service after changes constitutes acceptance of the updated Terms.</P>

      <H>15. Governing Law</H>
      <P>These Terms are governed by the laws of the jurisdiction in which PlayBeat Digital operates, without regard to conflict-of-law principles. Any disputes shall be resolved through good-faith negotiation first, and if unresolved, through binding arbitration.</P>

      <H>16. Contact</H>
      <P>For questions about these Terms, contact us at <strong className="text-cyan-glow">support@playbeat.digital</strong>.</P>
    </div>
  )
}

function PrivacyContent() {
  return (
    <div>
      <P>This Privacy Policy explains how <strong className="text-platinum">PlayBeat Digital</strong> collects, uses, and protects your information when you use our marketplace and services.</P>
      <H>1. Information We Collect</H>
      <ul className="ml-4 list-disc">
        <LI><strong>Account info:</strong> name, email address (for delivery and account management).</LI>
        <LI><strong>Order info:</strong> products purchased, transaction amounts, currency, order history.</LI>
        <LI><strong>Payment info:</strong> processed by Lemon Squeezy (Merchant of Record). We do not store card numbers or full payment credentials.</LI>
        <LI><strong>Usage data:</strong> pages visited, products viewed, device/browser info (for analytics and improvement).</LI>
      </ul>
      <H>2. How We Use Your Information</H>
      <ul className="ml-4 list-disc">
        <LI>To process and deliver your orders (download links, license keys, subscriptions).</LI>
        <LI>To send transactional emails (receipts, download links, renewal notices).</LI>
        <LI>To provide customer support and resolve disputes.</LI>
        <LI>To improve our products, services, and marketplace experience.</LI>
        <LI>To comply with legal and tax obligations.</LI>
      </ul>
      <H>3. Data Sharing</H>
      <P>We share data only with service providers essential to operations: <strong>Lemon Squeezy</strong> (payments, Merchant of Record), our database host <strong>Neon</strong>, and email delivery providers. We never sell your personal data. We may disclose data when required by law.</P>
      <H>4. Cookies</H>
      <P>We use essential cookies (cart, wishlist, currency preference, theme) stored locally in your browser. We do not use third-party advertising cookies.</P>
      <H>5. Data Security</H>
      <P>We use industry-standard measures (encrypted database connections, secure payment processing via Lemon Squeezy, access controls) to protect your data. No method of transmission is 100% secure, but we work to protect your information.</P>
      <H>6. Your Rights</H>
      <P>You may request access to, correction of, or deletion of your personal data by contacting <strong className="text-cyan-glow">support@playbeat.digital</strong>. You may unsubscribe from marketing emails at any time.</P>
      <H>7. Contact</H>
      <P>Privacy questions? Email <strong className="text-cyan-glow">support@playbeat.digital</strong>.</P>
    </div>
  )
}

function RefundContent() {
  return (
    <div>
      <P>Due to the instant and non-revocable nature of digital products, all sales are <strong className="text-platinum">generally final</strong>. However, PlayBeat Digital offers refunds in the following circumstances:</P>
      <H>1. Eligible Refunds</H>
      <ul className="ml-4 list-disc">
        <LI><strong>Product not delivered:</strong> if you didn't receive your download link or license key within 24 hours of payment.</LI>
        <LI><strong>Defective product:</strong> if the digital product is materially broken, corrupted, or non-functional and the issue cannot be resolved within 7 days.</LI>
        <LI><strong>Duplicate charge:</strong> if you were charged more than once for the same order.</LI>
        <LI><strong>Subscription cancellation:</strong> you may cancel a subscription at any time; the cancellation takes effect at the end of the current billing period (no charge for the next cycle). The current period is non-refundable.</LI>
      </ul>
      <H>2. Non-Refundable Cases</H>
      <ul className="ml-4 list-disc">
        <LI>Change of mind after delivery (since digital products cannot be "returned").</LI>
        <LI>Products that have been downloaded and/or activated with a license key.</LI>
        <LI>Failure to verify product compatibility before purchase.</LI>
        <LI>Products purchased on sale or with a discount code.</LI>
      </ul>
      <H>3. How to Request a Refund</H>
      <P>Contact <strong className="text-cyan-glow">support@playbeat.digital</strong> within <strong>14 days</strong> of your purchase with your order number and reason. Approved refunds are processed by Lemon Squeezy and typically appear within 5–10 business days.</P>
      <H>4. Chargebacks</H>
      <P>Please contact us before initiating a chargeback — most issues can be resolved faster directly. Unjustified chargebacks may result in account suspension and license key revocation.</P>
    </div>
  )
}

function LicenseContent() {
  return (
    <div>
      <P>Purchasing a digital product from PlayBeat Digital grants you a <strong className="text-platinum">license to use</strong> the product — not ownership of the underlying intellectual property. License scope varies per product and is specified on each product page.</P>
      <H>1. License Types</H>
      <ul className="ml-4 list-disc">
        <LI><strong>Personal License:</strong> for individual, non-commercial use by one person on their own devices.</LI>
        <LI><strong>Team License:</strong> for use by a specified number of seats within one organization.</LI>
        <LI><strong>Commercial / Extended License:</strong> permits use in commercial projects, client work, and products you sell (subject to product-specific terms).</LI>
        <LI><strong>Subscription License:</strong> valid for the duration of your active subscription; lapses if the subscription is cancelled.</LI>
      </ul>
      <H>2. What You May Do</H>
      <ul className="ml-4 list-disc">
        <LI>Use the product on the number of devices/seats specified by your license.</LI>
        <LI>Modify products for your own or your clients' projects (where the license permits).</LI>
        <LI>Use license keys to activate and access the product for the license term.</LI>
      </ul>
      <H>3. What You May Not Do</H>
      <ul className="ml-4 list-disc">
        <LI>Resell, sublicense, or redistribute the product or license key.</LI>
        <LI>Share license keys publicly or with unauthorized users.</LI>
        <LI>Reverse-engineer, decompile, or extract source code from protected products.</LI>
        <LI>Use the product in a competing product or service without an appropriate license.</LI>
      </ul>
      <H>4. License Key Revocation</H>
      <P>We reserve the right to revoke license keys found to be shared, resold, or used in violation of these terms. Revocation is without refund.</P>
      <H>5. Updates &amp; Support</H>
      <P>Unless stated otherwise, products include free lifetime updates. Support is provided for the period specified on the product page (typically 6 months from purchase).</P>
    </div>
  )
}
