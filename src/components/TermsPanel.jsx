const TERMS_HTML = `
<h2>Terms &amp; Conditions</h2>
<p class="terms-meta">Last Updated: September 3, 2026</p>
<p>Welcome to <strong>DUE</strong>. These Terms &amp; Conditions ("Terms") govern your access to and use of the DUE website, online store, products, services, and content available through <strong>duespace.com</strong> (collectively, the "Site").</p>
<p>By accessing the Site, placing an order, or purchasing a product from DUE, you acknowledge that you have read, understood, and agreed to these Terms.</p>
<p>If you do not agree with these Terms, please do not use the Site or purchase products from DUE.</p>
<h3>1. About DUE</h3>
<p>DUE is an independent fashion and creative brand based in Kigali, Rwanda.</p>
<p>Throughout these Terms, <strong>"DUE," "we," "us," and "our"</strong> refer to DUE and its operators.</p>
<p><strong>"You," "your," and "customer"</strong> refer to any person accessing the Site or purchasing products from DUE.</p>
<p>DUE reserves the right to update, modify, or replace these Terms at any time. Changes become effective when posted on the Site. Your continued use of the Site after changes are posted constitutes acceptance of the updated Terms.</p>
<h3>2. Eligibility</h3>
<p>You must be legally capable of entering into a purchase agreement in your jurisdiction to place an order through the Site.</p>
<p>By placing an order, you confirm that the information you provide is accurate and that you are authorized to use the payment method provided.</p>
<h3>3. Products</h3>
<p>DUE makes reasonable efforts to ensure that product descriptions, photographs, measurements, colors, and other information displayed on the Site are accurate. Colors may appear slightly different depending on your device or screen. Minor variations may occur between individual garments.</p>
<h3>4. Limited Availability</h3>
<p>DUE may release products in limited quantities. Adding a product to your cart does not guarantee availability until checkout is completed.</p>
<h3>5. Orders</h3>
<p>When you place an order through the Site, you are submitting an offer to purchase the selected products. DUE reserves the right to refuse, cancel, or limit an order for reasonable reasons including product unavailability, suspected fraudulent activity, or technical errors.</p>
<h3>6. Pricing</h3>
<p>All prices displayed on the Site are the prices applicable at the time of purchase. Prices may change at any time without prior notice.</p>
<h3>7. Payment</h3>
<p>Payment must be completed using a payment method made available through the Site or otherwise communicated by DUE.</p>
<hr>
<h3>8. All Sales Are Final</h3>
<p><strong>ALL SALES ARE FINAL.</strong></p>
<p>DUE does <strong>not</strong> accept returns, exchanges, or refunds for reasons including change of mind, incorrect size selection, or failure to review product information before purchasing.</p>
<p>If you receive a product that is <strong>defective, materially damaged, or materially different from what you ordered</strong>, contact DUE at <a href="mailto:duebydrew@gmail.com">duebydrew@gmail.com</a> as soon as reasonably possible.</p>
<h3>9. Shipping &amp; Delivery</h3>
<p>DUE will ship orders to the delivery address provided during checkout. You are responsible for ensuring your delivery information is complete and accurate. Estimated delivery times are estimates only.</p>
<h3>10. International Orders</h3>
<p>Where DUE accepts international orders, the customer may be responsible for customs duties, import taxes, or other charges imposed by the destination country.</p>
<h3>11. Delivery Issues</h3>
<p>If your package arrives damaged, incomplete, or materially different from what you ordered, contact DUE at <a href="mailto:duebydrew@gmail.com">duebydrew@gmail.com</a> as soon as reasonably possible.</p>
<h3>12. Defective or Incorrect Products</h3>
<p>If you believe you have received a defective or incorrect product, contact <a href="mailto:duebydrew@gmail.com">duebydrew@gmail.com</a>. After reviewing the issue, DUE may provide a replacement, repair, exchange, refund, or another appropriate remedy.</p>
<h3>13. Product Care</h3>
<p>Customers are responsible for following the care instructions provided with each product. DUE is not responsible for damage resulting from improper care.</p>
<h3>14. Order Cancellation</h3>
<p>Because all sales are final, customers should carefully review their order before completing checkout. Orders that have entered processing or shipping cannot generally be cancelled.</p>
<h3>15. Intellectual Property</h3>
<p>All content on the Site is owned by DUE or used with appropriate permission and is protected by applicable intellectual-property laws. You may not reproduce or commercially exploit DUE's intellectual property without prior written permission.</p>
<h3>16. Prohibited Use</h3>
<p>You agree not to use the Site to violate applicable laws, attempt unauthorized access, introduce malicious code, engage in fraudulent activity, or impersonate DUE or another person.</p>
<h3>17. Limitation of Liability</h3>
<p>To the maximum extent permitted by applicable law, DUE will not be responsible for indirect, incidental, or consequential losses arising from use of the Site or purchase of products.</p>
<h3>18. Privacy</h3>
<p>DUE will handle personal information in accordance with its applicable Privacy Policy and applicable data-protection laws.</p>
<h3>19. Governing Law</h3>
<p>These Terms will be governed by and interpreted in accordance with the applicable laws of Rwanda.</p>
<h3>20. Dispute Resolution</h3>
<p>If you have a dispute with DUE, contact us first at <a href="mailto:duebydrew@gmail.com">duebydrew@gmail.com</a> so that we can attempt to resolve the matter informally.</p>
<hr>
<h3>21. Contact</h3>
<p><strong>DUE</strong><br>Email: <a href="mailto:duebydrew@gmail.com">duebydrew@gmail.com</a><br>Website: duespace.com<br>Business Address: Kigali, Kibagabaga, Rwanda</p>
<h3>22. Acceptance</h3>
<p>By using the Site, placing an order, or purchasing a product from DUE, you acknowledge that you have had an opportunity to read these Terms and agree to be bound by them.</p>
<p><strong>ALL SALES ARE FINAL.</strong></p>
<p>Thank you for supporting DUE.</p>
`

export default function TermsPanel({ open, onClose }) {
  return (
    <div id="terms-panel" className={open ? 'open' : ''}>
      <button id="terms-back" aria-label="Back" onClick={onClose}>
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M15 4 L7 12 L15 20"/></svg>
      </button>
      <div id="terms-content" dangerouslySetInnerHTML={{ __html: TERMS_HTML }} />
    </div>
  )
}
