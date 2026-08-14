import { Sale } from '../types';
import { formatCurrency, formatDateTime } from './format';

export function printReceipt(sale: Sale, companyName: string, companyRuc?: string) {
  const itemsHtml = sale.items
    .map(
      (item) => `
      <tr>
        <td style="padding:6px 8px;border-bottom:1px solid #f1f5f9;">${item.productName}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #f1f5f9;text-align:center;">${item.quantity}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #f1f5f9;text-align:right;">${formatCurrency(item.unitPrice)}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #f1f5f9;text-align:right;font-weight:600;">${formatCurrency(item.subtotal)}</td>
      </tr>`
    )
    .join('');

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <title>Comprobante ${sale.receiptNumber}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 13px; color: #1e293b; background: #fff; }
    .page { max-width: 600px; margin: 40px auto; padding: 40px; border: 1px solid #e2e8f0; border-radius: 12px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; }
    .logo { font-size: 22px; font-weight: 800; color: #2563eb; }
    .company-info { text-align: right; font-size: 11px; color: #64748b; }
    .receipt-title { font-size: 18px; font-weight: 700; color: #0f172a; margin-bottom: 4px; }
    .receipt-sub { font-size: 11px; color: #94a3b8; }
    .divider { border: none; border-top: 1px solid #e2e8f0; margin: 20px 0; }
    .customer-box { background: #f8fafc; border-radius: 8px; padding: 14px 16px; margin-bottom: 24px; }
    .label { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; }
    .value { font-size: 13px; font-weight: 500; color: #1e293b; margin-top: 2px; }
    table { width: 100%; border-collapse: collapse; }
    thead th { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #94a3b8; padding: 8px; background: #f8fafc; }
    .totals { margin-top: 16px; display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
    .total-row { display: flex; gap: 40px; font-size: 13px; }
    .total-row.grand { font-size: 16px; font-weight: 800; color: #2563eb; border-top: 2px solid #e2e8f0; padding-top: 8px; margin-top: 4px; }
    .footer { margin-top: 32px; text-align: center; font-size: 11px; color: #94a3b8; }
    @media print { .page { border: none; margin: 0; border-radius: 0; } }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div>
        <div class="logo">${companyName}</div>
        ${companyRuc ? `<div style="font-size:11px;color:#64748b;margin-top:4px;">RUC: ${companyRuc}</div>` : ''}
      </div>
      <div class="company-info">
        <div class="receipt-title">COMPROBANTE</div>
        <div class="receipt-sub">${sale.receiptNumber}</div>
        <div style="margin-top:6px;font-size:11px;color:#64748b;">${formatDateTime(sale.createdAt)}</div>
      </div>
    </div>

    <div class="customer-box">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
        <div>
          <div class="label">Cliente</div>
          <div class="value">${sale.customerName}</div>
        </div>
        <div>
          <div class="label">Documento</div>
          <div class="value">${sale.customerDocument}</div>
        </div>
        <div>
          <div class="label">Vendedor</div>
          <div class="value">${sale.sellerName}</div>
        </div>
        <div>
          <div class="label">Estado</div>
          <div class="value" style="color:#10b981;">Completada</div>
        </div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th style="text-align:left;">Producto</th>
          <th style="text-align:center;">Cant.</th>
          <th style="text-align:right;">Precio</th>
          <th style="text-align:right;">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <div class="totals">
      <div class="total-row">
        <span style="color:#64748b;">Subtotal</span>
        <span>${formatCurrency(sale.subtotal)}</span>
      </div>
      <div class="total-row">
        <span style="color:#64748b;">IGV (18%)</span>
        <span>${formatCurrency(sale.igv)}</span>
      </div>
      <div class="total-row grand">
        <span>TOTAL</span>
        <span>${formatCurrency(sale.total)}</span>
      </div>
    </div>

    ${sale.notes ? `<div style="margin-top:20px;background:#f8fafc;border-radius:8px;padding:12px;font-size:12px;color:#64748b;"><strong>Notas:</strong> ${sale.notes}</div>` : ''}

    <div class="footer">
      Este es un comprobante interno demostrativo · TechLedger
    </div>
  </div>
  <script>window.onload = () => { window.print(); }</script>
</body>
</html>`;

  const popup = window.open('', '_blank', 'width=680,height=800');
  if (!popup) {
    alert('Permite las ventanas emergentes para imprimir el comprobante.');
    return;
  }
  popup.document.write(html);
  popup.document.close();
}
