import "server-only";

import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { sendMail, isMailConfigured } from "@/app/lib/mail";
import {
  getEntityBookkeepingSnapshot,
  updateEntityBookkeepingInvoice,
} from "@/domain/business/bookkeeping-dto";
import type { BusinessBookkeepingSnapshot } from "@/domain/business/bookkeeping";

type InvoiceContext = {
  profile: BusinessBookkeepingSnapshot["profile"];
  businessAddress: string | null;
  engagement: BusinessBookkeepingSnapshot["serviceEngagements"][number];
  invoice: BusinessBookkeepingSnapshot["invoices"][number];
  timeEntries: BusinessBookkeepingSnapshot["timeEntries"];
  providerDisplayName: string;
  clientDisplayName: string;
  defaultRecipientEmail: string;
  defaultRecipientName: string;
  currencyCode: string;
};

type DrawContext = {
  page: PDFPage;
  font: PDFFont;
  boldFont: PDFFont;
  margin: number;
  width: number;
  height: number;
  cursorY: number;
};

function formatDate(value: string | null | undefined) {
  if (!value) return "-";
  const parsed = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatMoney(value: number, currencyCode: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode || "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `$${value.toFixed(2)}`;
  }
}

function formatHours(value: number) {
  return `${value.toFixed(2)} h`;
}

function buildMultilineLines(value: string | null | undefined) {
  if (!value) return [];

  return value
    .replaceAll("\r\n", "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function textOrFallback(value: string | null | undefined, fallback = "-") {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : fallback;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function sanitizeFilenamePart(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

function buildPdfFileName(invoiceNumber: string) {
  const safeBase = sanitizeFilenamePart(invoiceNumber.trim()) || "invoice";
  return `${safeBase}.pdf`;
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return [""];

  const words = normalized.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      current = candidate;
      continue;
    }

    if (current) {
      lines.push(current);
      current = word;
      continue;
    }

    let remainder = word;
    while (remainder.length > 0) {
      let splitIndex = remainder.length;
      while (
        splitIndex > 1 &&
        font.widthOfTextAtSize(`${remainder.slice(0, splitIndex)}-`, size) > maxWidth
      ) {
        splitIndex -= 1;
      }

      if (splitIndex === remainder.length) {
        lines.push(remainder);
        remainder = "";
      } else {
        lines.push(`${remainder.slice(0, splitIndex)}-`);
        remainder = remainder.slice(splitIndex);
      }
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines;
}

function drawTextBlock(
  ctx: DrawContext,
  text: string,
  x: number,
  size: number,
  maxWidth: number,
  lineHeight: number,
  options?: { bold?: boolean; color?: ReturnType<typeof rgb> },
) {
  const font = options?.bold ? ctx.boldFont : ctx.font;
  const lines = wrapText(text, font, size, maxWidth);

  for (const line of lines) {
    ctx.page.drawText(line, {
      x,
      y: ctx.cursorY,
      size,
      font,
      color: options?.color ?? rgb(0.12, 0.15, 0.19),
    });
    ctx.cursorY -= lineHeight;
  }

  return lines.length;
}

function addPage(pdfDoc: PDFDocument, font: PDFFont, boldFont: PDFFont): DrawContext {
  const page = pdfDoc.addPage([612, 792]);
  return {
    page,
    font,
    boldFont,
    margin: 50,
    width: 612,
    height: 792,
    cursorY: 742,
  };
}

function ensureSpace(
  pdfDoc: PDFDocument,
  ctx: DrawContext,
  font: PDFFont,
  boldFont: PDFFont,
  requiredHeight: number,
) {
  if (ctx.cursorY - requiredHeight >= ctx.margin) {
    return ctx;
  }
  return addPage(pdfDoc, font, boldFont);
}

function drawRule(ctx: DrawContext) {
  ctx.page.drawLine({
    start: { x: ctx.margin, y: ctx.cursorY },
    end: { x: ctx.width - ctx.margin, y: ctx.cursorY },
    thickness: 1,
    color: rgb(0.87, 0.9, 0.93),
  });
  ctx.cursorY -= 16;
}

function buildProviderDisplayName(context: {
  profile: BusinessBookkeepingSnapshot["profile"];
  engagement: BusinessBookkeepingSnapshot["serviceEngagements"][number];
}) {
  return (
    context.profile?.dba_name?.trim() ||
    context.profile?.legal_name?.trim() ||
    context.engagement.provider_entity_name?.trim() ||
    "Community Pockets"
  );
}

function buildClientDisplayName(
  engagement: BusinessBookkeepingSnapshot["serviceEngagements"][number],
) {
  return engagement.client_entity_name?.trim() || engagement.counterparty_name?.trim() || "Client";
}

export async function getBusinessInvoiceContext(
  entityId: string,
  invoiceId: string,
): Promise<InvoiceContext> {
  const snapshot = await getEntityBookkeepingSnapshot(entityId);
  const invoice = snapshot.invoices.find((entry) => entry.id === invoiceId) ?? null;
  if (!invoice) {
    throw new Error("Invoice not found");
  }
  if (invoice.current_entity_role !== "provider") {
    throw new Error("Invoices can only be delivered from the provider workspace");
  }

  const engagement =
    snapshot.serviceEngagements.find((entry) => entry.id === invoice.engagement_id) ?? null;
  if (!engagement) {
    throw new Error("Invoice engagement not found");
  }

  const timeEntries = (snapshot.timeEntries ?? [])
    .filter((entry) => invoice.time_entry_ids.includes(entry.id))
    .sort((left, right) => left.work_date.localeCompare(right.work_date));

  return {
    profile: snapshot.profile,
    businessAddress: snapshot.businessAddress,
    engagement,
    invoice,
    timeEntries,
    providerDisplayName: buildProviderDisplayName({
      profile: snapshot.profile,
      engagement,
    }),
    clientDisplayName: buildClientDisplayName(engagement),
    defaultRecipientEmail: engagement.contact_email?.trim() || "",
    defaultRecipientName: engagement.contact_name?.trim() || buildClientDisplayName(engagement),
    currencyCode: engagement.currency_code?.trim() || "USD",
  };
}

export function buildBusinessInvoiceEmailSubject(context: InvoiceContext) {
  return `Invoice ${context.invoice.invoice_number} from ${context.providerDisplayName}`;
}

export function canSendBusinessInvoiceEmails() {
  return isMailConfigured();
}

export async function generateBusinessInvoicePdf(context: InvoiceContext) {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  let ctx = addPage(pdfDoc, font, boldFont);

  pdfDoc.setTitle(`Invoice ${context.invoice.invoice_number}`);
  pdfDoc.setAuthor(context.providerDisplayName);
  pdfDoc.setSubject(`Invoice for ${context.clientDisplayName}`);
  pdfDoc.setCreator("Community Pockets");
  pdfDoc.setProducer("Community Pockets");

  ctx.page.drawText("INVOICE", {
    x: ctx.margin,
    y: ctx.cursorY,
    size: 24,
    font: ctx.boldFont,
    color: rgb(0.13, 0.15, 0.19),
  });
  ctx.page.drawText(context.invoice.invoice_number, {
    x: ctx.width - ctx.margin - ctx.boldFont.widthOfTextAtSize(context.invoice.invoice_number, 18),
    y: ctx.cursorY + 3,
    size: 18,
    font: ctx.boldFont,
    color: rgb(0.82, 0.22, 0.14),
  });
  ctx.cursorY -= 30;

  drawTextBlock(ctx, context.providerDisplayName, ctx.margin, 13, 250, 16, {
    bold: true,
  });
  if (
    context.profile?.legal_name?.trim() &&
    context.profile.legal_name.trim() !== context.providerDisplayName
  ) {
    drawTextBlock(ctx, context.profile.legal_name.trim(), ctx.margin, 10, 250, 13);
  }
  for (const line of buildMultilineLines(context.businessAddress)) {
    drawTextBlock(ctx, line, ctx.margin, 10, 250, 13);
  }
  if (context.profile?.ein?.trim()) {
    drawTextBlock(ctx, `EIN: ${context.profile.ein.trim()}`, ctx.margin, 10, 250, 13);
  }

  const detailX = 360;
  let detailY = 712;
  const detailLines = [
    ["Issued", formatDate(context.invoice.issued_on)],
    ["Due", formatDate(context.invoice.due_on)],
    ["Status", textOrFallback(context.invoice.status ? context.invoice.status.toUpperCase() : "", "DRAFT")],
    ["Amount", formatMoney(context.invoice.total_amount, context.currencyCode)],
  ];
  for (const [label, value] of detailLines) {
    ctx.page.drawText(label, {
      x: detailX,
      y: detailY,
      size: 10,
      font: ctx.boldFont,
      color: rgb(0.43, 0.46, 0.51),
    });
    ctx.page.drawText(value, {
      x: detailX + 70,
      y: detailY,
      size: 10,
      font: ctx.font,
      color: rgb(0.13, 0.15, 0.19),
    });
    detailY -= 15;
  }

  ctx.cursorY = Math.min(ctx.cursorY, detailY - 18);
  drawRule(ctx);

  ctx.page.drawText("Bill To", {
    x: ctx.margin,
    y: ctx.cursorY,
    size: 11,
    font: ctx.boldFont,
    color: rgb(0.43, 0.46, 0.51),
  });
  ctx.cursorY -= 16;
  drawTextBlock(ctx, context.clientDisplayName, ctx.margin, 12, 250, 15, { bold: true });
  if (context.engagement.contact_name?.trim()) {
    drawTextBlock(ctx, context.engagement.contact_name.trim(), ctx.margin, 10, 250, 13);
  }
  if (context.engagement.contact_email?.trim()) {
    drawTextBlock(ctx, context.engagement.contact_email.trim(), ctx.margin, 10, 250, 13);
  }

  const summaryX = 360;
  let summaryY = ctx.cursorY + 29;
  const summaryLines = [
    ["Engagement", textOrFallback(context.engagement.title, "-")],
    [
      "Period",
      context.invoice.period_start || context.invoice.period_end
        ? `${formatDate(context.invoice.period_start)} - ${formatDate(context.invoice.period_end)}`
        : "-",
    ],
    ["Entries", String(context.invoice.entry_count)],
    ["Hours", formatHours(context.invoice.total_hours)],
  ];
  for (const [label, value] of summaryLines) {
    ctx.page.drawText(label, {
      x: summaryX,
      y: summaryY,
      size: 10,
      font: ctx.boldFont,
      color: rgb(0.43, 0.46, 0.51),
    });
    ctx.page.drawText(value, {
      x: summaryX + 70,
      y: summaryY,
      size: 10,
      font: ctx.font,
      color: rgb(0.13, 0.15, 0.19),
    });
    summaryY -= 15;
  }

  // Start the table below whichever side of the two-column summary extends lower.
  ctx.cursorY = Math.min(ctx.cursorY - 14, summaryY - 4);
  drawRule(ctx);

  const drawItemsHeader = () => {
    ctx.page.drawRectangle({
      x: ctx.margin,
      y: ctx.cursorY - 6,
      width: ctx.width - ctx.margin * 2,
      height: 22,
      color: rgb(0.96, 0.97, 0.98),
    });
    const headers = [
      { label: "Date", x: ctx.margin + 6 },
      { label: "Description", x: ctx.margin + 82 },
      { label: "Hours", x: ctx.margin + 360 },
      { label: "Rate", x: ctx.margin + 430 },
      { label: "Amount", x: ctx.margin + 500 },
    ];
    for (const header of headers) {
      ctx.page.drawText(header.label, {
        x: header.x,
        y: ctx.cursorY,
        size: 9,
        font: ctx.boldFont,
        color: rgb(0.43, 0.46, 0.51),
      });
    }
    ctx.cursorY -= 24;
  };

  drawItemsHeader();

  if (context.timeEntries.length === 0) {
    ctx = ensureSpace(pdfDoc, ctx, font, boldFont, 26);
    ctx.page.drawText("No billable time entries are attached to this invoice.", {
      x: ctx.margin + 6,
      y: ctx.cursorY,
      size: 10,
      font: ctx.font,
      color: rgb(0.33, 0.36, 0.4),
    });
    ctx.cursorY -= 24;
  } else {
    for (const entry of context.timeEntries) {
      const descriptionLines = wrapText(
        textOrFallback(entry.description, "-"),
        ctx.font,
        10,
        260,
      );
      const rowHeight = Math.max(22, descriptionLines.length * 13 + 8);
      const nextCtx = ensureSpace(pdfDoc, ctx, font, boldFont, rowHeight + 12);
      if (nextCtx !== ctx) {
        ctx = nextCtx;
        drawItemsHeader();
      }

      ctx.page.drawLine({
        start: { x: ctx.margin, y: ctx.cursorY + 4 },
        end: { x: ctx.width - ctx.margin, y: ctx.cursorY + 4 },
        thickness: 0.7,
        color: rgb(0.92, 0.93, 0.95),
      });

      ctx.page.drawText(formatDate(entry.work_date), {
        x: ctx.margin + 6,
        y: ctx.cursorY - 6,
        size: 10,
        font: ctx.font,
        color: rgb(0.13, 0.15, 0.19),
      });

      let descriptionY = ctx.cursorY - 6;
      for (const line of descriptionLines) {
        ctx.page.drawText(line, {
          x: ctx.margin + 82,
          y: descriptionY,
          size: 10,
          font: ctx.font,
          color: rgb(0.13, 0.15, 0.19),
        });
        descriptionY -= 13;
      }

      ctx.page.drawText(formatHours(entry.hours), {
        x: ctx.margin + 360,
        y: ctx.cursorY - 6,
        size: 10,
        font: ctx.font,
        color: rgb(0.13, 0.15, 0.19),
      });
      ctx.page.drawText(
        entry.effective_hourly_rate !== null && entry.effective_hourly_rate !== undefined
          ? formatMoney(entry.effective_hourly_rate, context.currencyCode)
          : "-",
        {
          x: ctx.margin + 430,
          y: ctx.cursorY - 6,
          size: 10,
          font: ctx.font,
          color: rgb(0.13, 0.15, 0.19),
        },
      );
      ctx.page.drawText(formatMoney(entry.amount, context.currencyCode), {
        x: ctx.margin + 500,
        y: ctx.cursorY - 6,
        size: 10,
        font: ctx.font,
        color: rgb(0.13, 0.15, 0.19),
      });

      ctx.cursorY -= rowHeight;
    }
  }

  ctx.cursorY -= 8;
  drawRule(ctx);

  const totalLabelX = ctx.width - ctx.margin - 170;
  const totalValueX = ctx.width - ctx.margin - 10;
  const totals = [
    ["Hours", formatHours(context.invoice.total_hours)],
    ["Total", formatMoney(context.invoice.total_amount, context.currencyCode)],
  ];
  for (const [label, value] of totals) {
    ctx.page.drawText(label, {
      x: totalLabelX,
      y: ctx.cursorY,
      size: label === "Total" ? 12 : 10,
      font: label === "Total" ? ctx.boldFont : ctx.font,
      color: rgb(0.13, 0.15, 0.19),
    });
    const valueFont = label === "Total" ? ctx.boldFont : ctx.font;
    const valueSize = label === "Total" ? 12 : 10;
    ctx.page.drawText(value, {
      x: totalValueX - valueFont.widthOfTextAtSize(value, valueSize),
      y: ctx.cursorY,
      size: valueSize,
      font: valueFont,
      color: label === "Total" ? rgb(0.82, 0.22, 0.14) : rgb(0.13, 0.15, 0.19),
    });
    ctx.cursorY -= 18;
  }

  if (context.invoice.notes?.trim()) {
    ctx.cursorY -= 8;
    ctx = ensureSpace(pdfDoc, ctx, font, boldFont, 60);
    ctx.page.drawText("Notes", {
      x: ctx.margin,
      y: ctx.cursorY,
      size: 11,
      font: ctx.boldFont,
      color: rgb(0.43, 0.46, 0.51),
    });
    ctx.cursorY -= 16;
    drawTextBlock(ctx, context.invoice.notes.trim(), ctx.margin, 10, 512, 13);
  }

  return pdfDoc.save();
}

function buildInvoiceEmailParts(context: InvoiceContext, message: string | null) {
  const trimmedMessage = message?.trim() || "";
  const greetingName = context.defaultRecipientName || context.clientDisplayName;
  const invoiceAmount = formatMoney(context.invoice.total_amount, context.currencyCode);
  const dueLabel = context.invoice.due_on ? formatDate(context.invoice.due_on) : "the due date listed on the invoice";

  const lines = [
    `Hello ${greetingName},`,
    "",
    `Please find attached invoice ${context.invoice.invoice_number} for ${invoiceAmount}.`,
    `The invoice is due on ${dueLabel}.`,
  ];

  if (trimmedMessage) {
    lines.push("", trimmedMessage);
  }

  lines.push("", "Thank you,", context.providerDisplayName);

  const htmlParagraphs = [
    `<p>Hello ${escapeHtml(greetingName)},</p>`,
    `<p>Please find attached invoice <strong>${escapeHtml(context.invoice.invoice_number)}</strong> for <strong>${escapeHtml(invoiceAmount)}</strong>.</p>`,
    `<p>The invoice is due on ${escapeHtml(dueLabel)}.</p>`,
  ];

  if (trimmedMessage) {
    htmlParagraphs.push(
      `<p>${escapeHtml(trimmedMessage).replaceAll("\n", "<br />")}</p>`,
    );
  }

  htmlParagraphs.push(`<p>Thank you,<br />${escapeHtml(context.providerDisplayName)}</p>`);

  return {
    text: lines.join("\n"),
    html: htmlParagraphs.join(""),
  };
}

export async function sendBusinessInvoiceEmail(params: {
  entityId: string;
  invoiceId: string;
  to: string;
  subject?: string | null;
  message?: string | null;
}) {
  if (!canSendBusinessInvoiceEmails()) {
    throw new Error("Mail transport is not configured");
  }

  const context = await getBusinessInvoiceContext(params.entityId, params.invoiceId);
  if (context.invoice.status === "void") {
    throw new Error("Void invoices cannot be emailed");
  }

  const pdfBytes = await generateBusinessInvoicePdf(context);
  const subject = params.subject?.trim() || buildBusinessInvoiceEmailSubject(context);
  const emailBody = buildInvoiceEmailParts(context, params.message ?? null);

  await sendMail({
    to: params.to.trim(),
    subject,
    text: emailBody.text,
    html: emailBody.html,
    attachments: [
      {
        filename: buildPdfFileName(context.invoice.invoice_number),
        content: Buffer.from(pdfBytes),
        contentType: "application/pdf",
      },
    ],
  });

  if (context.invoice.status === "draft") {
    await updateEntityBookkeepingInvoice(params.entityId, {
      id: context.invoice.id,
      engagement_id: context.invoice.engagement_id,
      invoice_number: context.invoice.invoice_number,
      period_start: context.invoice.period_start,
      period_end: context.invoice.period_end,
      issued_on: context.invoice.issued_on,
      due_on: context.invoice.due_on,
      status: "sent",
      notes: context.invoice.notes,
      time_entry_ids: context.invoice.time_entry_ids,
    });
  }

  return getEntityBookkeepingSnapshot(params.entityId);
}

export function getBusinessInvoicePdfFileName(invoiceNumber: string) {
  return buildPdfFileName(invoiceNumber);
}
