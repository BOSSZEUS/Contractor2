import type { LineItemTemplate } from "@/types/templates"
import type { LaborRates } from "@/components/labor-rate-manager"
import type { EnhancedLineItem, QuoteCalculation } from "@/types/enhanced-quotes"

// Unified calculation function for all quote line items
export function calculateLineItemTotal(item: {
  quantity: number
  basePrice?: number
  laborHours?: number
  laborRate?: number
  materialCost?: number
  markup?: number
}): QuoteCalculation {
  const quantity = item.quantity || 1
  const basePrice = item.basePrice || 0
  const laborHours = item.laborHours || 0
  const laborRate = item.laborRate || 0
  const materialCost = item.materialCost || 0
  const markupPercent = item.markup || 0

  // Calculate base costs
  const laborCost = laborHours * laborRate * quantity
  const materialTotal = materialCost * quantity
  const baseCost = basePrice * quantity

  // Subtotal before markup
  const subtotal = laborCost + materialTotal + baseCost

  // Apply markup
  const markupMultiplier = 1 + markupPercent / 100
  const markupAmount = subtotal * (markupPercent / 100)
  const total = subtotal * markupMultiplier

  return {
    laborCost,
    materialCost: materialTotal,
    subtotal,
    markupAmount,
    total,
  }
}

export function calculateLineItemCost(
  template: LineItemTemplate,
  quantity: number,
  laborRates: LaborRates,
): QuoteCalculation {
  // Get effective labor rate for this category
  const laborRate = laborRates.categories[template.category] || laborRates.global

  return calculateLineItemTotal({
    quantity,
    basePrice: template.basePrice,
    laborHours: template.laborHours,
    laborRate,
    materialCost: template.materialCost,
    markup: template.markup,
  })
}

export function createEnhancedLineItem(
  template: LineItemTemplate,
  quantity: number,
  laborRates: LaborRates,
): EnhancedLineItem {
  const calculation = calculateLineItemCost(template, quantity, laborRates)
  const laborRate = laborRates.categories[template.category] || laborRates.global

  return {
    id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    description: template.name,
    quantity,
    unit: template.unit,

    // Enhanced pricing fields
    laborHours: template.laborHours,
    laborRate,
    materialCost: template.materialCost,
    markup: template.markup,

    // Calculated costs
    laborCost: calculation.laborCost,
    materialTotal: calculation.materialCost,
    subtotal: calculation.subtotal,
    markupAmount: calculation.markupAmount,
    total: calculation.total,

    // Backward compatibility
    unitPrice: calculation.total / quantity,
    deleted: false,
    note: "",
  }
}

export function calculateQuoteTotals(lineItems: EnhancedLineItem[]) {
  const activeItems = lineItems.filter((item) => !item.deleted)

  const totalLabor = activeItems.reduce((sum, item) => sum + (item.laborCost || 0), 0)
  const totalMaterials = activeItems.reduce((sum, item) => sum + (item.materialTotal || 0), 0)
  const totalMarkup = activeItems.reduce((sum, item) => sum + (item.markupAmount || 0), 0)
  const subtotal = activeItems.reduce((sum, item) => sum + (item.subtotal || item.total), 0)
  const total = activeItems.reduce((sum, item) => sum + item.total, 0)

  return {
    totalLabor,
    totalMaterials,
    totalMarkup,
    subtotal,
    total,
  }
}

// Helper function to recalculate line item when values change
export function recalculateLineItem(item: EnhancedLineItem): EnhancedLineItem {
  const calculation = calculateLineItemTotal({
    quantity: item.quantity,
    basePrice: item.unitPrice ? item.unitPrice / item.quantity : 0,
    laborHours: item.laborHours,
    laborRate: item.laborRate,
    materialCost: item.materialCost,
    markup: item.markup,
  })

  return {
    ...item,
    laborCost: calculation.laborCost,
    materialTotal: calculation.materialCost,
    subtotal: calculation.subtotal,
    markupAmount: calculation.markupAmount,
    total: calculation.total,
    unitPrice: calculation.total / item.quantity,
  }
}
