"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { EnhancedLineItem } from "@/types/enhanced-quotes"

interface QuoteCostBreakdownProps {
  lineItems: EnhancedLineItem[]
  showLineItemDetails?: boolean
  className?: string
}

const getNumber = (value: unknown, fallback = 0) =>
  typeof value === "number" && !Number.isNaN(value) ? value : fallback

export function QuoteCostBreakdown({
  lineItems,
  showLineItemDetails = false,
  className = "",
}: QuoteCostBreakdownProps) {
  const activeItems = lineItems.filter((item) => !item.deleted)

  const totals = {
    labor: activeItems.reduce((s, i) => s + getNumber(i.laborCost), 0),
    materials: activeItems.reduce((s, i) => s + getNumber(i.materialTotal), 0),
    markup: activeItems.reduce((s, i) => s + getNumber(i.markupAmount), 0),
    subtotal: activeItems.reduce(
      (s, i) =>
        s +
        getNumber(
          i.subtotal ??
            // legacy fallback
            // @ts-expect-error
            i.line_total ??
            i.unitPrice * i.quantity,
        ),
      0,
    ),
    total: activeItems.reduce(
      (s, i) =>
        s +
        getNumber(
          i.total ??
            // @ts-expect-error
            i.line_total ??
            i.unitPrice * i.quantity,
        ),
      0,
    ),
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Cost Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {showLineItemDetails && (
          <div className="space-y-3">
            <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Line Item Details</h4>
            {activeItems.map((item) => (
              <div key={item.id} className="border rounded-lg p-3 space-y-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium">{item.description}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {item.quantity} {item.unit}
                      </Badge>
                      {item.laborHours && (
                        <Badge variant="secondary" className="text-xs">
                          {item.laborHours}h @ ${item.laborRate?.toFixed(2)}/hr
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    {/* Use total, or fall back to line_total/unit_price * quantity */}
                    <p className="font-semibold">
                      $
                      {getNumber(
                        (item.total as number | undefined) ??
                          // @ts-expect-error – line_total only exists on legacy objects
                          item.line_total ??
                          item.unitPrice * item.quantity,
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>

                {(item.laborCost > 0 || item.materialTotal > 0 || item.markupAmount > 0) && (
                  <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground pt-2 border-t">
                    {item.laborCost > 0 && (
                      <div>
                        <span className="block">Labor</span>
                        <span className="font-medium">${item.laborCost.toFixed(2)}</span>
                      </div>
                    )}
                    {item.materialTotal > 0 && (
                      <div>
                        <span className="block">Materials</span>
                        <span className="font-medium">${item.materialTotal.toFixed(2)}</span>
                      </div>
                    )}
                    {item.markupAmount > 0 && (
                      <div>
                        <span className="block">Markup ({item.markup}%)</span>
                        <span className="font-medium">${item.markupAmount.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Summary Totals */}
        <div className="space-y-3 pt-4 border-t">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Quote Summary</h4>
          <div className="space-y-2">
            {totals.labor > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Labor Subtotal:</span>
                <span className="font-medium">${totals.labor.toFixed(2)}</span>
              </div>
            )}
            {totals.materials > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Materials Subtotal:</span>
                <span className="font-medium">${totals.materials.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="font-medium">${totals.subtotal.toFixed(2)}</span>
            </div>
            {totals.markup > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Markup:</span>
                <span className="font-medium">${totals.markup.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total:</span>
              <span>${totals.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
