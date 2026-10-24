import type {Metadata} from "next";
export const metadata:Metadata={title:"Final Sale Policy | Dionne’s Boutique",description:"Review Dionne’s Boutique final-sale, damaged-item and order-issue policies."};
export default function ReturnsPolicy(){
return <main style={{maxWidth:760,margin:"auto",padding:"64px 24px",fontFamily:"Georgia,serif",lineHeight:1.8,color:"#352a25"}}>
<a href="/" style={{color:"#80602d"}}>← Dionne’s Boutique</a>
<p style={{letterSpacing:3,textTransform:"uppercase",marginTop:48}}>Shopping policies</p>
<h1>All Sales Final</h1><h2>No Returns · No Exchanges · No Discretionary Refunds</h2>
<p>Please review your order carefully before completing checkout. Dionne’s Boutique does not accept returns or exchanges for change of mind, incorrect selections, or unwanted merchandise. Discretionary refunds are not offered.</p>
<h2>Damaged, Defective, Incorrect, or Incomplete Orders</h2>
<p>If an item arrives damaged, defective, incorrect, or incomplete, please contact our customer service team promptly with your order number and supporting photographs when available. We will review the issue and provide an appropriate resolution consistent with applicable law.</p>
<h2>Unfulfilled Orders</h2><p>If we cannot fulfill an order, we will cancel the unfulfilled portion and refund any payment collected for it.</p>
<h2>Your Rights</h2><p>Nothing in this policy limits rights or remedies required by applicable consumer protection law or payment network rules.</p>
<p style={{marginTop:48}}>Thank you for shopping with Dionne’s Boutique.</p>
</main>;
}
