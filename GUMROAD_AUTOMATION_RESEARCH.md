# Gumroad Automation Capabilities - Complete Research

## 1. AUTOMATION FEATURES

### 1.1 Automatic Delivery System
**Capabilities:**
- **Instant delivery**: Digital products are delivered immediately after payment confirmation
- **Automated file hosting**: Gumroad hosts your files (no external storage needed)
- **Unique download links**: Each customer gets a unique, secure download link
- **Download limit control**: Set number of downloads allowed per purchase
- **Expiration options**: Links can expire after set time period
- **Version updates**: Update product files and customers automatically get access to new versions

**How it works:**
1. Customer completes purchase
2. Gumroad processes payment
3. Receipt email sent with download link automatically
4. Files delivered via Gumroad's CDN
5. Customer can access their library at gumroad.com/library

### 1.2 Email Customization
**Automation capabilities:**
- **Custom receipt emails**: Personalize confirmation emails with your branding
- **Follow-up sequences**: Set up automated email workflows post-purchase
- **Email variables**: Dynamic content insertion (customer name, product name, etc.)
- **HTML customization**: Full control over email templates
- **Delay settings**: Schedule emails to send at specific intervals

**Available email types:**
1. Purchase confirmation (immediate)
2. Product delivery (immediate)
3. Follow-up emails (scheduled)
4. Update notifications (when product is updated)
5. Refund notifications (automatic)

### 1.3 License Key Generation
**Features:**
- **Automatic generation**: Unique license keys created for each purchase
- **Custom format**: Define your own key format/pattern
- **Bulk generation**: Generate thousands of keys in advance
- **One-time use**: Keys can be set to single-use only
- **Verification API**: Validate keys programmatically
- **Key management**: Track which keys are used/unused

**Use cases:**
- Software licensing
- Course access codes
- Premium feature unlocks
- Serial number distribution

### 1.4 Webhook Capabilities
**Real-time notifications for:**
- `sale`: New purchase completed
- `refund`: Purchase refunded
- `dispute`: Payment disputed
- `dispute_won`: Dispute resolved in your favor
- `cancellation`: Subscription cancelled
- `subscription_updated`: Subscription plan changed
- `subscription_ended`: Subscription ended
- `subscription_restarted`: Subscription restarted

**Webhook payload includes:**
- Customer email and name
- Product details
- Purchase amount
- Transaction ID
- Custom fields data
- License key (if applicable)
- Affiliate info (if applicable)

### 1.5 Affiliate Program
**Yes, Gumroad has built-in affiliate capabilities:**

**Features:**
- **Built-in affiliate system**: No third-party tools needed
- **Custom commission rates**: Set your own percentage (1-100%)
- **Automatic tracking**: Cookie-based affiliate attribution
- **Affiliate dashboard**: Affiliates can track their earnings
- **Automatic payouts**: Gumroad handles affiliate payments
- **Custom affiliate links**: Each affiliate gets unique URL
- **Performance analytics**: Track conversions by affiliate

**How to enable:**
1. Go to product settings
2. Enable "Allow affiliates"
3. Set commission percentage
4. Share product link with affiliates
5. They append `?a=AFFILIATE_ID` to create their link

**Commission structure:**
- You set the percentage
- Deducted from your payout (not added to price)
- Affiliates paid directly by Gumroad
- 90-day cookie window (default)

### 1.6 Discount Codes and Bundles
**Discount codes:**
- **Percentage off**: 10%, 25%, 50%, etc.
- **Fixed amount**: $5 off, $10 off, etc.
- **Limited uses**: Set maximum redemptions
- **Expiration dates**: Time-limited offers
- **Minimum purchase**: Require minimum cart value
- **First-time customers**: Restrict to new buyers only
- **Recurring discounts**: Apply to subscription renewals

**Bundles:**
- **Product bundling**: Combine multiple products
- **Automatic pricing**: Set bundle discount
- **Single checkout**: One transaction for all items
- **Individual delivery**: Each product delivered separately
- **Bundle analytics**: Track bundle performance

### 1.7 Subscription Products
**Capabilities:**
- **Recurring billing**: Monthly, quarterly, yearly intervals
- **Automatic renewals**: No manual intervention needed
- **Subscription tiers**: Create multiple membership levels
- **Content dripping**: Release content over time
- **Trial periods**: Offer free trials before charging
- **Prorated upgrades**: Automatic calculation when changing plans
- **Grace periods**: Set dunning periods for failed payments
- **Cancellation management**: Automated end-of-period cancellations

**Subscription features:**
- Automatic failed payment retries
- Email notifications for renewals
- Customer can manage from their dashboard
- Export subscriber lists
- Webhook events for all subscription changes

### 1.8 Pay-What-You-Want Pricing
**Features:**
- **Minimum price**: Set floor price (can be $0)
- **Suggested price**: Recommend a price to customers
- **Full flexibility**: Customers choose their price
- **Works with all products**: Available for any product type
- **Analytics**: See average paid price
- **Combination**: Can combine with discount codes

**Best practices:**
- Set minimum to cover costs + fees
- Suggested price 20-30% higher than minimum
- Great for testing price points
- Builds goodwill with customers

---

## 2. INTEGRATION WITH WEBSITE

### 2.1 Overlay Checkout vs Redirect
**Overlay (Recommended for better UX):**
- Customer stays on your site
- Checkout appears in modal
- Better conversion rates
- Seamless experience
- Mobile-responsive

**Redirect:**
- Customer goes to gumroad.com
- Traditional checkout flow
- Simpler implementation
- Works without JavaScript

### 2.2 Pre-filled Checkout Links
You can pass data via URL parameters:
- `?wanted=true`: Skip product page, go straight to checkout
- `?email=customer@email.com`: Pre-fill email
- `?quantity=5`: Set quantity
- `?variant=Basic`: Pre-select variant
- Custom fields can be pre-filled

### 2.3 Custom Button Styling
- Full CSS control over buttons
- Custom classes and IDs
- Brand colors and fonts
- Responsive design
- Animation support

### 2.4 Post-Purchase Redirects
- Redirect to thank you page
- Pass purchase data to your site
- Trigger conversion pixels
- Show custom confirmation
- Integrate with analytics

### 2.5 Passing Calculator Results to Checkout
Can pass data through:
- URL parameters
- Custom fields
- Variant selection
- Quantity parameter
- JavaScript API

---

## 3. PAYMENT & FEES

### 3.1 Transaction Fees
**Pricing structure (as of 2024-2025):**
- **10% fee** on all transactions
- **No monthly fees**
- **No setup fees**
- **No hidden costs**

**What's included in 10%:**
- Payment processing
- File hosting and delivery
- Email delivery
- Customer support
- Fraud protection
- VAT/sales tax handling
- Payout processing

**Additional costs:**
- PayPal transactions: PayPal's fee applies in addition
- Currency conversion: Bank/payment processor fees may apply

### 3.2 Payment Methods Accepted
**Customers can pay with:**
- Credit/debit cards (Visa, Mastercard, Amex, Discover)
- PayPal
- Apple Pay
- Google Pay
- Cash App (US only)
- Bank transfers (some regions)

**Seller receives:**
- Direct deposits to bank account
- PayPal payouts
- Debit card (instant payouts for fee)

### 3.3 Payout Frequency
**Options:**
- **Weekly**: Every Friday (default)
- **Monthly**: First Friday of month
- **Automatic**: When balance reaches threshold
- **Instant**: Pay fee for immediate payout (~$1)

**Processing time:**
- Bank transfer: 2-7 business days
- PayPal: 1-3 business days
- Instant payout: Within minutes (fee applies)

### 3.4 Minimum Payout
- **$10 minimum** for automatic payouts
- Can manually request payout for any amount
- No maximum limit
- Multiple payout methods supported

### 3.5 International Support
**Global capabilities:**
- Sell from 190+ countries
- Accept 100+ currencies
- Automatic currency conversion
- Multi-language checkout
- VAT/GST handling included
- Regional payment methods

**Tax handling:**
- Automatic EU VAT collection
- US sales tax (where applicable)
- GST for Australia, New Zealand
- Seller provides tax info
- Year-end tax documents provided

---

## 4. PRODUCT TYPES SUPPORTED

### 4.1 Digital Downloads
**Supported formats:**
- PDF, EPUB (ebooks)
- MP3, WAV, FLAC (audio)
- MP4, MOV (video)
- ZIP, RAR (archives)
- PSD, AI (design files)
- XLSX, CSV (spreadsheets)
- Any file type (no restrictions)

**File size limits:**
- **5GB per file** (increased from 2GB)
- Unlimited number of files per product
- No bandwidth limits
- CDN delivery worldwide
- Automatic file compression option

### 4.2 Memberships/Subscriptions
**Features:**
- Recurring monthly/yearly billing
- Content library access
- Drip content scheduling
- Multiple membership tiers
- Member-only posts
- Community features
- Cancel anytime option

### 4.3 Courses
**Course capabilities:**
- Video lessons
- Downloadable resources
- Progress tracking
- Certificate generation
- Cohort-based access
- Lifetime or subscription access
- Chapter organization

### 4.4 License Keys
**Advanced licensing:**
- Generate unique keys
- Activation tracking
- Multi-device licensing
- Renewal management
- Validation API
- Bulk key generation
- Custom key formats

### 4.5 Additional Product Types
- Physical products (with shipping)
- Services/consulting
- Rentals (time-limited access)
- Pre-orders
- Commissions
- Tickets/events

---

## 5. CUSTOMER MANAGEMENT (AUTOMATED)

### 5.1 Automatic Receipts
- Sent immediately after purchase
- Includes transaction details
- Tax information included
- Downloadable PDF
- Customizable branding

### 5.2 Download Links
- Unique per customer
- Secure and encrypted
- IP tracking (optional)
- Download limits
- Expiration dates
- Re-download access via library

### 5.3 License Key Delivery
- Included in receipt email
- Displayed on thank-you page
- Stored in customer library
- Copy-paste ready format
- Validation documentation

### 5.4 Refund Handling
**Automated process:**
- Seller can enable/disable refunds
- Set refund window (days)
- Automatic or manual approval
- Email notifications sent
- Payment reversed automatically
- Access revoked if applicable
- Webhook triggered

**Refund options:**
- Full refunds
- Partial refunds
- Custom refund amounts
- Refund + keep access option

---

## CODE EXAMPLES

### Example 1: Embedding Gumroad Buttons in React

```jsx
// components/GumroadButton.jsx
import React, { useEffect } from 'react';

const GumroadButton = ({
  productId,
  text = "Buy Now",
  className = "",
  variant = null,
  email = null,
  wanted = false
}) => {
  useEffect(() => {
    // Load Gumroad script
    if (!window.GumroadOverlay) {
      const script = document.createElement('script');
      script.src = 'https://gumroad.com/js/gumroad.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Build URL with parameters
  const buildUrl = () => {
    let url = `https://gumroad.com/l/${productId}`;
    const params = new URLSearchParams();

    if (wanted) params.append('wanted', 'true');
    if (email) params.append('email', email);
    if (variant) params.append('variant', variant);

    const queryString = params.toString();
    return queryString ? `${url}?${queryString}` : url;
  };

  return (
    <a
      className={`gumroad-button ${className}`}
      href={buildUrl()}
      data-gumroad-overlay-checkout="true"
    >
      {text}
    </a>
  );
};

export default GumroadButton;
```

**Usage:**
```jsx
import GumroadButton from './components/GumroadButton';

function ProductPage() {
  return (
    <div>
      <h1>My Excel Calculator</h1>

      {/* Simple button */}
      <GumroadButton
        productId="your-product-id"
        text="Buy Calculator - $29"
      />

      {/* Pre-filled email */}
      <GumroadButton
        productId="your-product-id"
        email="customer@example.com"
        wanted={true}
        text="Complete Purchase"
      />

      {/* With variant selection */}
      <GumroadButton
        productId="your-product-id"
        variant="Premium"
        text="Buy Premium Version"
      />
    </div>
  );
}
```

### Example 2: Passing Calculator Results to Gumroad Checkout

```jsx
// components/CalculatorWithGumroad.jsx
import React, { useState } from 'react';

const CalculatorWithGumroad = ({ productId }) => {
  const [results, setResults] = useState(null);
  const [customerEmail, setCustomerEmail] = useState('');

  const handleCalculate = (inputs) => {
    // Your calculation logic
    const calculatedResults = performCalculations(inputs);
    setResults(calculatedResults);
  };

  const handlePurchase = () => {
    // Build Gumroad URL with custom fields
    const params = new URLSearchParams({
      wanted: 'true',
      email: customerEmail,
      // Pass calculation results as custom fields
      'custom_fields[roi]': results.roi,
      'custom_fields[savings]': results.savings,
      'custom_fields[calculation_date]': new Date().toISOString()
    });

    const gumroadUrl = `https://gumroad.com/l/${productId}?${params.toString()}`;

    // Open in overlay or new window
    if (window.GumroadOverlay) {
      window.GumroadOverlay.open(gumroadUrl);
    } else {
      window.open(gumroadUrl, '_blank');
    }
  };

  return (
    <div className="calculator-container">
      {/* Calculator inputs */}
      <div className="calculator-inputs">
        {/* Your input fields */}
      </div>

      {/* Results display */}
      {results && (
        <div className="results">
          <h3>Your Results:</h3>
          <p>ROI: {results.roi}%</p>
          <p>Savings: ${results.savings}</p>

          <input
            type="email"
            placeholder="Enter your email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
          />

          <button onClick={handlePurchase}>
            Get Full Calculator Access
          </button>
        </div>
      )}
    </div>
  );
};

export default CalculatorWithGumroad;
```

**Advanced version with post-purchase redirect:**
```jsx
const handlePurchaseWithRedirect = () => {
  // Save results to localStorage or sessionStorage
  const purchaseData = {
    results: results,
    timestamp: Date.now(),
    email: customerEmail
  };

  sessionStorage.setItem('calculatorResults', JSON.stringify(purchaseData));

  // Gumroad URL with redirect
  const redirectUrl = encodeURIComponent(
    `${window.location.origin}/thank-you?calculator=true`
  );

  const params = new URLSearchParams({
    wanted: 'true',
    email: customerEmail,
    'redirect_url': redirectUrl
  });

  window.location.href = `https://gumroad.com/l/${productId}?${params.toString()}`;
};
```

### Example 3: Creating Product Bundles

```jsx
// components/ProductBundle.jsx
import React, { useState } from 'react';

const ProductBundle = () => {
  const products = [
    {
      id: 'calculator-basic',
      name: 'Basic Calculator',
      price: 29,
      checked: false
    },
    {
      id: 'calculator-pro',
      name: 'Pro Calculator',
      price: 59,
      checked: false
    },
    {
      id: 'templates',
      name: 'Excel Templates Pack',
      price: 19,
      checked: false
    },
    {
      id: 'training',
      name: 'Video Training',
      price: 39,
      checked: false
    }
  ];

  const [selectedProducts, setSelectedProducts] = useState(products);

  const toggleProduct = (id) => {
    setSelectedProducts(selectedProducts.map(p =>
      p.id === id ? { ...p, checked: !p.checked } : p
    ));
  };

  const calculateTotal = () => {
    const total = selectedProducts
      .filter(p => p.checked)
      .reduce((sum, p) => sum + p.price, 0);

    // Apply bundle discount (e.g., 20% off for 3+ items)
    const selectedCount = selectedProducts.filter(p => p.checked).length;
    const discount = selectedCount >= 3 ? 0.20 : selectedCount >= 2 ? 0.10 : 0;

    return {
      subtotal: total,
      discount: total * discount,
      total: total * (1 - discount),
      discountPercent: discount * 100
    };
  };

  const handleBundlePurchase = () => {
    const selected = selectedProducts.filter(p => p.checked);

    if (selected.length === 0) {
      alert('Please select at least one product');
      return;
    }

    // For Gumroad bundles, you have two options:

    // Option 1: Use pre-created bundle product
    if (selected.length === products.length) {
      // Redirect to "Complete Bundle" product
      window.location.href = 'https://gumroad.com/l/complete-bundle?wanted=true';
    }

    // Option 2: Use discount codes for custom bundles
    const pricing = calculateTotal();
    const discountCode = selected.length >= 3 ? 'BUNDLE20' : 'BUNDLE10';

    // Redirect to primary product with discount code
    window.location.href =
      `https://gumroad.com/l/${selected[0].id}?discount_code=${discountCode}`;
  };

  const pricing = calculateTotal();

  return (
    <div className="product-bundle">
      <h2>Build Your Bundle</h2>

      <div className="products-list">
        {selectedProducts.map(product => (
          <label key={product.id} className="product-item">
            <input
              type="checkbox"
              checked={product.checked}
              onChange={() => toggleProduct(product.id)}
            />
            <span className="product-name">{product.name}</span>
            <span className="product-price">${product.price}</span>
          </label>
        ))}
      </div>

      <div className="pricing-summary">
        <div>Subtotal: ${pricing.subtotal}</div>
        {pricing.discount > 0 && (
          <div className="discount">
            Bundle Discount ({pricing.discountPercent}%):
            -${pricing.discount.toFixed(2)}
          </div>
        )}
        <div className="total">Total: ${pricing.total.toFixed(2)}</div>
      </div>

      <button
        onClick={handleBundlePurchase}
        className="purchase-bundle-btn"
      >
        Purchase Bundle
      </button>
    </div>
  );
};

export default ProductBundle;
```

**Alternative: Using Gumroad's native bundle creation**
```javascript
// In your Gumroad dashboard:
// 1. Create a new product called "Complete Bundle"
// 2. Set price to discounted bundle price
// 3. Upload all files from individual products
// 4. In description, list what's included

// Then in your React app:
const BundleButton = () => (
  <a
    href="https://gumroad.com/l/complete-bundle?wanted=true"
    className="gumroad-button"
    data-gumroad-overlay-checkout="true"
  >
    Get Complete Bundle - Save 30%
  </a>
);
```

### Example 4: Setting Up Automatic Email Sequences

**Note:** Gumroad's email automation is configured in the dashboard, but you can trigger webhooks to integrate with email platforms like ConvertKit, Mailchimp, etc.

```javascript
// server/webhooks/gumroad.js
// This runs on your backend to handle Gumroad webhooks

const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// Email service integration (example with SendGrid)
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Verify Gumroad webhook signature
const verifyGumroadSignature = (payload, signature) => {
  const hash = crypto
    .createHmac('sha256', process.env.GUMROAD_WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');
  return hash === signature;
};

router.post('/gumroad-webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['x-gumroad-signature'];

  if (!verifyGumroadSignature(req.body, signature)) {
    return res.status(401).send('Invalid signature');
  }

  const event = JSON.parse(req.body);

  switch (event.type) {
    case 'sale':
      await handleNewSale(event);
      break;
    case 'refund':
      await handleRefund(event);
      break;
    case 'cancellation':
      await handleCancellation(event);
      break;
  }

  res.status(200).send('Webhook processed');
});

async function handleNewSale(event) {
  const { email, product_name, sale_id, product_id } = event;

  // 1. Send immediate welcome email
  await sendEmail({
    to: email,
    template: 'welcome',
    data: {
      productName: product_name,
      downloadLink: `https://app.gumroad.com/d/${sale_id}`
    }
  });

  // 2. Schedule follow-up emails
  await scheduleEmailSequence(email, product_id);

  // 3. Add to CRM/email list
  await addToEmailList(email, {
    product: product_name,
    purchaseDate: new Date()
  });

  // 4. Trigger any custom automation
  await updateCustomerDatabase(event);
}

async function scheduleEmailSequence(email, productId) {
  const sequences = {
    'calculator-basic': [
      { delay: 1, template: 'getting-started' },
      { delay: 3, template: 'tips-and-tricks' },
      { delay: 7, template: 'upgrade-offer' },
      { delay: 30, template: 'review-request' }
    ],
    'calculator-pro': [
      { delay: 1, template: 'pro-welcome' },
      { delay: 3, template: 'advanced-features' },
      { delay: 7, template: 'case-studies' },
      { delay: 14, template: 'template-bonus' },
      { delay: 30, template: 'review-request' }
    ]
  };

  const sequence = sequences[productId] || [];

  for (const step of sequence) {
    await scheduleEmail({
      to: email,
      template: step.template,
      sendAt: Date.now() + (step.delay * 24 * 60 * 60 * 1000)
    });
  }
}

async function sendEmail({ to, template, data }) {
  const templates = {
    welcome: {
      subject: 'Welcome! Here\'s your calculator',
      html: `
        <h1>Thanks for your purchase!</h1>
        <p>Your ${data.productName} is ready.</p>
        <a href="${data.downloadLink}">Download Now</a>
      `
    },
    'getting-started': {
      subject: 'Getting started with your calculator',
      html: `
        <h1>Let's get you started</h1>
        <p>Here are 3 quick tips...</p>
      `
    },
    'upgrade-offer': {
      subject: 'Ready for more features?',
      html: `
        <h1>Upgrade to Pro</h1>
        <p>Get 20% off with code: UPGRADE20</p>
      `
    }
  };

  const emailTemplate = templates[template];

  await sgMail.send({
    to,
    from: 'noreply@yourdomain.com',
    subject: emailTemplate.subject,
    html: emailTemplate.html
  });
}

module.exports = router;
```

**React component to display email sequence information:**
```jsx
// components/EmailSequencePreview.jsx
const EmailSequencePreview = ({ productType }) => {
  const sequences = {
    basic: [
      { day: 0, title: 'Welcome & Download Link', description: 'Immediate access to your calculator' },
      { day: 1, title: 'Getting Started Guide', description: 'Step-by-step tutorial' },
      { day: 3, title: 'Tips & Tricks', description: '5 ways to maximize your ROI' },
      { day: 7, title: 'Upgrade Offer', description: '20% discount on Pro version' },
      { day: 30, title: 'How Are You Doing?', description: 'Feedback request + bonus template' }
    ],
    pro: [
      { day: 0, title: 'Pro Welcome Package', description: 'All files + bonus templates' },
      { day: 1, title: 'Advanced Features Tour', description: 'Video walkthrough' },
      { day: 3, title: 'Case Studies', description: 'Real-world examples' },
      { day: 7, title: 'Monthly Template Update', description: 'New templates added' },
      { day: 14, title: 'Exclusive Webinar Invite', description: 'Live Q&A session' },
      { day: 30, title: 'Review + Referral Bonus', description: 'Get 30% off next purchase' }
    ]
  };

  const sequence = sequences[productType] || sequences.basic;

  return (
    <div className="email-sequence-preview">
      <h3>What You'll Receive:</h3>
      <div className="timeline">
        {sequence.map((email, index) => (
          <div key={index} className="email-item">
            <div className="day-badge">Day {email.day}</div>
            <div className="email-content">
              <h4>{email.title}</h4>
              <p>{email.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

### Example 5: Advanced Integration - Passing Calculator Results with Variants

```jsx
// components/AdvancedCalculatorCheckout.jsx
import React, { useState, useEffect } from 'react';

const AdvancedCalculatorCheckout = () => {
  const [calculatorData, setCalculatorData] = useState({
    revenue: 0,
    expenses: 0,
    growth: 0
  });

  const [results, setResults] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState('basic');

  // Product variants configuration
  const variants = {
    basic: {
      name: 'Basic Calculator',
      price: 29,
      features: ['Core calculations', 'PDF export', 'Email support'],
      gumroadVariant: 'Basic'
    },
    pro: {
      name: 'Pro Calculator',
      price: 59,
      features: ['Advanced analytics', 'Custom branding', 'Priority support', 'Lifetime updates'],
      gumroadVariant: 'Pro'
    },
    enterprise: {
      name: 'Enterprise',
      price: 199,
      features: ['Multi-user access', 'API access', 'White-label', 'Dedicated support'],
      gumroadVariant: 'Enterprise'
    }
  };

  const calculateResults = () => {
    const roi = ((calculatorData.revenue - calculatorData.expenses) / calculatorData.expenses * 100).toFixed(2);
    const projectedGrowth = (calculatorData.revenue * (1 + calculatorData.growth / 100)).toFixed(2);

    setResults({
      roi,
      projectedGrowth,
      savings: (calculatorData.revenue - calculatorData.expenses).toFixed(2)
    });
  };

  const handleCheckout = () => {
    const variant = variants[selectedVariant];

    // Create checkout URL with all parameters
    const params = new URLSearchParams({
      wanted: 'true',
      variant: variant.gumroadVariant,
      // Pass calculation results as custom fields
      'custom_fields[revenue]': calculatorData.revenue,
      'custom_fields[expenses]': calculatorData.expenses,
      'custom_fields[roi]': results.roi,
      'custom_fields[projected_growth]': results.projectedGrowth,
      'custom_fields[selected_plan]': variant.name,
      'custom_fields[calculation_date]': new Date().toISOString()
    });

    const checkoutUrl = `https://gumroad.com/l/your-product-id?${params.toString()}`;

    // Track conversion
    if (window.gtag) {
      window.gtag('event', 'begin_checkout', {
        currency: 'USD',
        value: variant.price,
        items: [{
          item_id: selectedVariant,
          item_name: variant.name,
          price: variant.price
        }]
      });
    }

    // Open checkout
    if (window.GumroadOverlay) {
      window.GumroadOverlay.open(checkoutUrl);
    } else {
      window.location.href = checkoutUrl;
    }
  };

  return (
    <div className="advanced-calculator">
      {/* Calculator Inputs */}
      <div className="calculator-section">
        <h2>Financial Calculator</h2>

        <input
          type="number"
          placeholder="Annual Revenue"
          value={calculatorData.revenue}
          onChange={(e) => setCalculatorData({
            ...calculatorData,
            revenue: parseFloat(e.target.value) || 0
          })}
        />

        <input
          type="number"
          placeholder="Annual Expenses"
          value={calculatorData.expenses}
          onChange={(e) => setCalculatorData({
            ...calculatorData,
            expenses: parseFloat(e.target.value) || 0
          })}
        />

        <input
          type="number"
          placeholder="Expected Growth %"
          value={calculatorData.growth}
          onChange={(e) => setCalculatorData({
            ...calculatorData,
            growth: parseFloat(e.target.value) || 0
          })}
        />

        <button onClick={calculateResults}>Calculate</button>
      </div>

      {/* Results Display */}
      {results && (
        <div className="results-section">
          <h3>Your Results</h3>
          <div className="result-item">
            <span>ROI:</span>
            <strong>{results.roi}%</strong>
          </div>
          <div className="result-item">
            <span>Projected Revenue:</span>
            <strong>${results.projectedGrowth}</strong>
          </div>
          <div className="result-item">
            <span>Net Savings:</span>
            <strong>${results.savings}</strong>
          </div>

          {/* Variant Selection */}
          <div className="variants-section">
            <h3>Choose Your Plan</h3>

            {Object.entries(variants).map(([key, variant]) => (
              <div
                key={key}
                className={`variant-card ${selectedVariant === key ? 'selected' : ''}`}
                onClick={() => setSelectedVariant(key)}
              >
                <h4>{variant.name}</h4>
                <p className="price">${variant.price}</p>
                <ul>
                  {variant.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <button
            onClick={handleCheckout}
            className="checkout-button"
          >
            Get {variants[selectedVariant].name} - ${variants[selectedVariant].price}
          </button>
        </div>
      )}
    </div>
  );
};

export default AdvancedCalculatorCheckout;
```

### Example 6: Webhook Handler for License Key Distribution

```javascript
// server/gumroad-webhook-handler.js
const express = require('express');
const app = express();

// Generate custom license key
function generateLicenseKey(saleId, email) {
  const crypto = require('crypto');
  const hash = crypto
    .createHash('sha256')
    .update(`${saleId}-${email}-${process.env.LICENSE_SECRET}`)
    .digest('hex');

  // Format: XXXX-XXXX-XXXX-XXXX
  const key = hash.substring(0, 16).toUpperCase();
  return `${key.slice(0,4)}-${key.slice(4,8)}-${key.slice(8,12)}-${key.slice(12,16)}`;
}

app.post('/webhooks/gumroad', express.json(), async (req, res) => {
  const event = req.body;

  if (event.type === 'sale') {
    const licenseKey = generateLicenseKey(event.sale_id, event.email);

    // Store in database
    await db.licenses.create({
      key: licenseKey,
      email: event.email,
      productId: event.product_id,
      saleId: event.sale_id,
      activatedAt: null,
      maxActivations: 3,
      currentActivations: 0
    });

    // Send email with license key
    await sendLicenseEmail(event.email, licenseKey, event.product_name);
  }

  res.status(200).json({ received: true });
});

// License validation endpoint
app.post('/api/validate-license', async (req, res) => {
  const { licenseKey, deviceId } = req.body;

  const license = await db.licenses.findOne({ key: licenseKey });

  if (!license) {
    return res.status(404).json({ valid: false, message: 'Invalid license key' });
  }

  if (license.currentActivations >= license.maxActivations) {
    return res.status(403).json({
      valid: false,
      message: 'Maximum activations reached'
    });
  }

  // Activate license
  await db.licenses.update(
    { key: licenseKey },
    {
      $inc: { currentActivations: 1 },
      $push: { devices: deviceId }
    }
  );

  res.json({ valid: true, license });
});
```

---

## COMPLETE WORKFLOW EXAMPLE

Here's how everything works together for a fully automated product:

### 1. Customer Journey
```
Customer visits website
  → Uses calculator
  → Sees personalized results
  → Selects product variant
  → Clicks purchase button (Gumroad overlay opens)
  → Completes payment
  → Receives instant email with:
    - Download link
    - License key
    - Getting started guide
  → Webhook triggers on your server
  → Customer added to email sequence
  → Follow-up emails sent automatically over 30 days
```

### 2. Setup Checklist

**In Gumroad Dashboard:**
- [ ] Create product
- [ ] Upload files (up to 5GB each)
- [ ] Set up variants (Basic, Pro, Enterprise)
- [ ] Configure custom fields
- [ ] Enable affiliate program
- [ ] Create discount codes
- [ ] Set up webhook URL
- [ ] Customize email templates
- [ ] Enable pay-what-you-want (optional)

**In Your React App:**
- [ ] Install Gumroad script
- [ ] Create GumroadButton component
- [ ] Build calculator with results
- [ ] Add variant selection UI
- [ ] Pass data to checkout URL
- [ ] Set up post-purchase redirect
- [ ] Add analytics tracking

**On Your Server:**
- [ ] Create webhook endpoint
- [ ] Verify webhook signatures
- [ ] Handle sale events
- [ ] Generate license keys
- [ ] Set up email sequences
- [ ] Create license validation API
- [ ] Store customer data

### 3. Example .env Configuration
```bash
# Gumroad
GUMROAD_PRODUCT_ID=your-product-id
GUMROAD_WEBHOOK_SECRET=your-webhook-secret
GUMROAD_ACCESS_TOKEN=your-access-token

# Email
SENDGRID_API_KEY=your-sendgrid-key
FROM_EMAIL=noreply@yourdomain.com

# License Generation
LICENSE_SECRET=your-secret-key

# App
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

---

## BEST PRACTICES

### For Maximum Automation:
1. **Use webhooks** for real-time updates
2. **Pre-fill customer data** to reduce friction
3. **Enable overlay checkout** for better UX
4. **Set up email sequences** immediately
5. **Use custom fields** to pass calculator data
6. **Automate license delivery** via webhooks
7. **Create bundles** for higher average order value
8. **Enable affiliates** for automated marketing
9. **Use pay-what-you-want** for list building
10. **Set up automatic refunds** with time limits

### Security Considerations:
- Always verify webhook signatures
- Use HTTPS for all redirects
- Store sensitive data server-side only
- Rate-limit license validation endpoints
- Log all transactions for audit trail

### Conversion Optimization:
- Use overlay checkout (not redirect)
- Pre-fill email when possible
- Show social proof on product page
- Offer money-back guarantee
- Create urgency with limited-time offers
- Bundle products for higher AOV
- Use discount codes strategically

---

## SUMMARY

Gumroad provides **100% automation** for digital product sales:

**Zero manual work needed for:**
- Payment processing
- File delivery
- Email receipts
- Download link generation
- License key creation
- Customer management
- Refund processing
- Subscription billing
- Affiliate tracking & payouts
- Tax collection & remittance

**You control:**
- Product pricing
- Email customization
- Discount strategies
- Refund policies
- Payout frequency
- Affiliate commission rates

**Integration effort:**
- Basic: 15 minutes (just add a button)
- Advanced: 2-4 hours (full calculator integration + webhooks)
- Enterprise: 1-2 days (custom email sequences, license system, analytics)

The platform handles everything automatically, allowing you to focus on creating great products while Gumroad manages the entire sales infrastructure.
