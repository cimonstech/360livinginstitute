'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { PricingSettings as PricingSettingsType, Service } from '@/types'

type Props = {
  pricing: PricingSettingsType | null
  services: Service[]
}

export default function PricingSettings({ pricing, services }: Props) {
  const router = useRouter()
  const [showPrices, setShowPrices] = useState(pricing?.show_prices ?? true)
  const [globalPrice, setGlobalPrice] = useState(Number(pricing?.global_price_ghs ?? 0))
  const [momoNumber, setMomoNumber] = useState(pricing?.momo_number ?? '0538045503')
  const [momoName, setMomoName] = useState(pricing?.momo_name ?? 'Selasi Doku')
  const [instructions, setInstructions] = useState(
    pricing?.payment_instructions ??
      'Payment is made via Mobile Money (MoMo). Use your Booking ID as the payment reference.'
  )
  const [saving, setSaving] = useState(false)
  const [savingServices, setSavingServices] = useState(false)

  const [rows, setRows] = useState(
    services.map((s) => ({
      id: s.id,
      use_global_price: s.use_global_price !== false,
      price_override_ghs: s.price_override_ghs != null ? Number(s.price_override_ghs) : '',
    }))
  )

  async function savePricing() {
    setSaving(true)
    try {
      const res = await fetch('/api/settings/pricing', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          show_prices: showPrices,
          global_price_ghs: globalPrice,
          momo_number: momoNumber,
          momo_name: momoName,
          payment_instructions: instructions,
        }),
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || 'Save failed')
      router.refresh()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function saveServicesPricing() {
    setSavingServices(true)
    try {
      const payload = rows.map((r) => ({
        id: r.id,
        use_global_price: r.use_global_price,
        price_override_ghs: r.use_global_price ? null : Number(r.price_override_ghs) || 0,
      }))
      const res = await fetch('/api/settings/services-pricing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ services: payload }),
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || 'Save failed')
      router.refresh()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSavingServices(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-gray-100 bg-white p-6">
        <h2 className="mb-5 font-lora text-lg text-charcoal">Pricing & Payment</h2>
        <div className="flex flex-col gap-4 font-dm text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={showPrices} onChange={(e) => setShowPrices(e.target.checked)} />
            <span>Show prices to clients</span>
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-charcoal-muted">Global Session Price (GHS)</span>
            <input
              type="number"
              step="0.01"
              min={0}
              value={globalPrice}
              onChange={(e) => setGlobalPrice(Number(e.target.value))}
              className="max-w-xs rounded-xl border border-gray-200 px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-charcoal-muted">MoMo Number</span>
            <input
              value={momoNumber}
              onChange={(e) => setMomoNumber(e.target.value)}
              className="max-w-md rounded-xl border border-gray-200 px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-charcoal-muted">MoMo Name</span>
            <input
              value={momoName}
              onChange={(e) => setMomoName(e.target.value)}
              className="max-w-md rounded-xl border border-gray-200 px-3 py-2"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs text-charcoal-muted">Payment Instructions</span>
            <textarea
              rows={4}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="rounded-xl border border-gray-200 px-3 py-2"
            />
          </label>
        </div>
        <button
          type="button"
          disabled={saving}
          onClick={() => void savePricing()}
          className="mt-6 rounded-full bg-brand-pink px-6 py-2.5 font-dm text-sm font-medium text-white disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save Pricing'}
        </button>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6">
        <h2 className="mb-5 font-lora text-lg text-charcoal">Per-service pricing</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left font-dm text-sm">
            <thead className="border-b border-gray-100 text-xs text-charcoal-muted">
              <tr>
                <th className="py-2 pr-4 font-medium">Service</th>
                <th className="py-2 pr-4 font-medium">Price type</th>
                <th className="py-2 font-medium">Custom (GHS)</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => {
                const svc = services.find((s) => s.id === r.id)
                return (
                  <tr key={r.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-3 pr-4 text-charcoal">{svc?.title ?? r.id}</td>
                    <td className="py-3 pr-4">
                      <div className="flex rounded-full border border-gray-200 p-0.5">
                        <button
                          type="button"
                          onClick={() =>
                            setRows((prev) =>
                              prev.map((x, j) => (j === i ? { ...x, use_global_price: true } : x))
                            )
                          }
                          className={`rounded-full px-3 py-1 text-xs ${
                            r.use_global_price ? 'bg-brand-pink text-white' : 'text-charcoal-muted'
                          }`}
                        >
                          Global
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setRows((prev) =>
                              prev.map((x, j) => (j === i ? { ...x, use_global_price: false } : x))
                            )
                          }
                          className={`rounded-full px-3 py-1 text-xs ${
                            !r.use_global_price ? 'bg-brand-pink text-white' : 'text-charcoal-muted'
                          }`}
                        >
                          Custom
                        </button>
                      </div>
                    </td>
                    <td className="py-3">
                      {!r.use_global_price ? (
                        <input
                          type="number"
                          step="0.01"
                          min={0}
                          value={r.price_override_ghs}
                          onChange={(e) =>
                            setRows((prev) =>
                              prev.map((x, j) => (j === i ? { ...x, price_override_ghs: e.target.value } : x))
                            )
                          }
                          className="w-28 rounded-xl border border-gray-200 px-2 py-1"
                        />
                      ) : (
                        <span className="text-charcoal-muted">—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          disabled={savingServices}
          onClick={() => void saveServicesPricing()}
          className="mt-6 rounded-full border border-charcoal px-6 py-2.5 font-dm text-sm text-charcoal hover:bg-charcoal-light disabled:opacity-50"
        >
          {savingServices ? 'Saving…' : 'Save service prices'}
        </button>
      </div>
    </div>
  )
}
