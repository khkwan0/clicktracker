'use client'

import React, {useState} from 'react'
import {useTranslations} from 'next-intl'
import {
  createOffer,
  updateOffer,
  deactivateOffer,
  type OfferInput,
} from './actions'

type Advertiser = {id: string; name: string}
type CampaignOption = {
  id: string
  name: string
  advertiserId: string
  advertiser: Advertiser
}
type Offer = {
  id: number
  campaignId: string
  advertiserId: string
  clickUrl: string
  isActive: boolean
  requiresApproval: boolean
  campaign: {id: string; name: string; advertiser: Advertiser}
  advertiser: Advertiser
}

type OffersCrudProps = {
  offers: Offer[]
  campaigns: CampaignOption[]
  advertisers: Advertiser[]
  locale: string
}

const emptyForm: OfferInput = {
  campaignId: '',
  advertiserId: '',
  clickUrl: '',
  requiresApproval: false,
}

export function OffersCrud({
  offers,
  campaigns,
  advertisers,
  locale,
}: OffersCrudProps): React.ReactElement {
  const t = useTranslations('OffersPage')
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<OfferInput>(emptyForm)
  const [message, setMessage] = useState<{type: 'ok' | 'error'; text: string} | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)
  const [showInactive, setShowInactive] = useState(false)
  const [filterAdvertiserId, setFilterAdvertiserId] = useState<string>('')
  const [filterCampaignId, setFilterCampaignId] = useState<string>('')

  const filteredOffers = offers.filter((o) => {
    if (!showInactive && !o.isActive) return false
    if (filterAdvertiserId && o.advertiserId !== filterAdvertiserId) return false
    if (filterCampaignId && o.campaignId !== filterCampaignId) return false
    return true
  })

  const openCreate = () => {
    setEditingId(null)
    const first = campaigns[0]
    setForm({
      campaignId: first?.id ?? '',
      advertiserId: first?.advertiserId ?? '',
      clickUrl: '',
      requiresApproval: false,
    })
    setFormOpen(true)
    setMessage(null)
  }

  const openEdit = (o: Offer) => {
    setEditingId(o.id)
    setForm({
      campaignId: o.campaignId,
      advertiserId: o.advertiserId,
      clickUrl: o.clickUrl,
      requiresApproval: o.requiresApproval,
    })
    setFormOpen(true)
    setMessage(null)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  const onCampaignChange = (campaignId: string) => {
    const campaign = campaigns.find((c) => c.id === campaignId)
    setForm((f) => ({
      ...f,
      campaignId,
      advertiserId: campaign?.advertiserId ?? f.advertiserId,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.campaignId || !form.advertiserId || !form.clickUrl.trim()) {
      setMessage({type: 'error', text: t('error')})
      return
    }
    const payload: OfferInput = {
      campaignId: form.campaignId,
      advertiserId: form.advertiserId,
      clickUrl: form.clickUrl.trim(),
      requiresApproval: form.requiresApproval ?? false,
    }
    if (editingId !== null) {
      const res = await updateOffer(editingId, payload, locale)
      if (res.ok) {
        setMessage({type: 'ok', text: t('updated')})
        closeForm()
      } else {
        setMessage({type: 'error', text: res.error ?? t('error')})
      }
    } else {
      const res = await createOffer(payload, locale)
      if (res.ok) {
        setMessage({type: 'ok', text: t('created')})
        closeForm()
      } else {
        setMessage({type: 'error', text: res.error ?? t('error')})
      }
    }
  }

  const handleDeactivateClick = (id: number) => {
    setConfirmDeleteId(id)
  }

  const handleDeactivateConfirm = async (id: number) => {
    setDeletingId(id)
    const res = await deactivateOffer(id, locale)
    setDeletingId(null)
    setConfirmDeleteId(null)
    if (res.ok) {
      setMessage({type: 'ok', text: t('deactivated')})
    } else {
      setMessage({type: 'error', text: res.error ?? t('error')})
    }
  }

  const campaignsForFilter =
    filterAdvertiserId
      ? campaigns.filter((c) => c.advertiserId === filterAdvertiserId)
      : campaigns

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-foreground/80">{t('subtitle')}</p>
        <button
          type="button"
          onClick={openCreate}
          disabled={campaigns.length === 0}
          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
          {t('newOffer')}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-foreground/10 bg-foreground/5 px-4 py-3">
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
            className="h-4 w-4 rounded border-foreground/20 text-foreground focus:ring-foreground/20"
          />
          {showInactive ? t('hideInactive') : t('showInactive')}
        </label>
        <span className="text-foreground/40">|</span>
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="filter-advertiser" className="text-sm text-foreground/80">
            {t('filterByAdvertiser')}:
          </label>
          <select
            id="filter-advertiser"
            value={filterAdvertiserId}
            onChange={(e) => {
              setFilterAdvertiserId(e.target.value)
              setFilterCampaignId('')
            }}
            className="rounded-md border border-foreground/20 bg-background px-3 py-1.5 text-sm text-foreground focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/20">
            <option value="">{t('filterAll')}</option>
            {advertisers.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="filter-campaign" className="text-sm text-foreground/80">
            {t('filterByCampaign')}:
          </label>
          <select
            id="filter-campaign"
            value={filterCampaignId}
            onChange={(e) => setFilterCampaignId(e.target.value)}
            className="rounded-md border border-foreground/20 bg-background px-3 py-1.5 text-sm text-foreground focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/20">
            <option value="">{t('filterAll')}</option>
            {campaignsForFilter.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {campaigns.length === 0 && (
        <p className="rounded-md border border-foreground/10 bg-foreground/5 px-4 py-3 text-sm text-foreground/80">
          {t('noCampaigns')}
        </p>
      )}

      {message && (
        <div
          role="alert"
          className={`rounded-md border px-4 py-3 text-sm ${
            message.type === 'ok'
              ? 'border-green-500/30 bg-green-500/10 text-green-700 dark:text-green-400'
              : 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400'
          }`}>
          {message.text}
        </div>
      )}

      {filteredOffers.length === 0 && campaigns.length > 0 ? (
        <p className="rounded-md border border-foreground/10 bg-foreground/5 px-4 py-6 text-center text-foreground/80">
          {t('noOffers')}
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-foreground/10">
          <table className="min-w-full divide-y divide-foreground/10">
            <thead className="bg-foreground/5">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground/80">
                  {t('campaign')}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground/80">
                  {t('advertiser')}
                </th>
                <th
                  scope="col"
                  className="hidden px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground/80 sm:table-cell">
                  {t('clickUrl')}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground/80">
                  {t('requiresApproval')}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-foreground/80">
                  {t('status')}
                </th>
                <th scope="col" className="relative px-4 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/10 bg-background">
              {filteredOffers.map((o) => (
                <tr key={o.id} className="hover:bg-foreground/5">
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-foreground">
                    {o.campaign.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-foreground/80">
                    {o.advertiser.name}
                  </td>
                  <td className="hidden max-w-[12rem] truncate px-4 py-3 text-sm text-foreground/80 sm:table-cell">
                    {o.clickUrl}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-foreground/80">
                    {o.requiresApproval ? t('yes') : t('no')}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-foreground/80">
                    {o.isActive ? t('active') : t('inactive')}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                    {o.isActive && (
                      <>
                        <button
                          type="button"
                          onClick={() => openEdit(o)}
                          className="text-foreground/80 hover:text-foreground hover:underline">
                          {t('editOffer')}
                        </button>
                        <span className="mx-2 text-foreground/20">|</span>
                        {confirmDeleteId === o.id ? (
                          <span className="inline-flex items-center gap-2">
                            <span className="text-foreground/60">{t('deactivateConfirm')}</span>
                            <button
                              type="button"
                              onClick={() => handleDeactivateConfirm(o.id)}
                              disabled={deletingId === o.id}
                              className="text-red-600 hover:underline disabled:opacity-50">
                              {t('deactivate')}
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="text-foreground/60 hover:underline">
                              {t('cancel')}
                            </button>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleDeactivateClick(o.id)}
                            className="text-foreground/80 hover:text-red-600 hover:underline">
                            {t('deactivate')}
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {formOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="offer-form-title">
          <div className="w-full max-w-md rounded-lg border border-foreground/10 bg-background p-6 shadow-xl">
            <h2 id="offer-form-title" className="text-lg font-semibold text-foreground">
              {editingId !== null ? t('editOffer') : t('createOffer')}
            </h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label htmlFor="offer-campaign" className="mb-1 block text-sm font-medium text-foreground">
                  {t('campaign')} <span className="text-red-500">*</span>
                </label>
                <select
                  id="offer-campaign"
                  required
                  value={form.campaignId}
                  onChange={(e) => onCampaignChange(e.target.value)}
                  className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/20">
                  <option value="">—</option>
                  {campaigns.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.advertiser.name})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="offer-clickUrl" className="mb-1 block text-sm font-medium text-foreground">
                  {t('clickUrl')} <span className="text-red-500">*</span>
                </label>
                <input
                  id="offer-clickUrl"
                  type="url"
                  required
                  value={form.clickUrl}
                  onChange={(e) => setForm((f) => ({...f, clickUrl: e.target.value}))}
                  className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/20"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="offer-requiresApproval"
                  type="checkbox"
                  checked={form.requiresApproval ?? false}
                  onChange={(e) => setForm((f) => ({...f, requiresApproval: e.target.checked}))}
                  className="h-4 w-4 rounded border-foreground/20 text-foreground focus:ring-foreground/20"
                />
                <label htmlFor="offer-requiresApproval" className="text-sm font-medium text-foreground">
                  {t('requiresApproval')}
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-md border border-foreground/20 px-4 py-2 text-sm font-medium text-foreground hover:bg-foreground/10">
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90">
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
