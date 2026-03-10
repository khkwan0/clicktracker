'use client'

import React, {useState} from 'react'
import {useTranslations} from 'next-intl'
import {
  createCampaign,
  updateCampaign,
  deleteCampaign,
  type CampaignInput,
} from './actions'

type Advertiser = {id: string; name: string}
type Campaign = {
  id: string
  name: string
  clickUrl: string | null
  clickTag: string | null
  advertiserId: string
  advertiser: Advertiser
  totalClicks: number
  clicksLast24h: number
}

type CampaignsCrudProps = {
  campaigns: Campaign[]
  advertisers: Advertiser[]
  locale: string
}

const emptyForm: CampaignInput = {
  name: '',
  advertiserId: '',
  clickUrl: '',
  clickTag: '',
}

export function CampaignsCrud({
  campaigns,
  advertisers,
  locale,
}: CampaignsCrudProps): React.ReactElement {
  const t = useTranslations('CampaignsPage')
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<CampaignInput>(emptyForm)
  const [message, setMessage] = useState<{type: 'ok' | 'error'; text: string} | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const openCreate = () => {
    setEditingId(null)
    setForm({
      ...emptyForm,
      advertiserId: advertisers[0]?.id ?? '',
    })
    setFormOpen(true)
    setMessage(null)
  }

  const openEdit = (c: Campaign) => {
    setEditingId(c.id)
    setForm({
      name: c.name,
      advertiserId: c.advertiserId,
      clickUrl: c.clickUrl ?? '',
      clickTag: c.clickTag ?? '',
    })
    setFormOpen(true)
    setMessage(null)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.advertiserId) {
      setMessage({type: 'error', text: t('error')})
      return
    }
    const payload: CampaignInput = {
      name: form.name.trim(),
      advertiserId: form.advertiserId,
      clickUrl: form.clickUrl?.trim() || null,
      clickTag: form.clickTag?.trim() || null,
    }
    if (editingId) {
      const res = await updateCampaign(editingId, payload, locale)
      if (res.ok) {
        setMessage({type: 'ok', text: t('updated')})
        closeForm()
      } else {
        setMessage({type: 'error', text: res.error ?? t('error')})
      }
    } else {
      const res = await createCampaign(payload, locale)
      if (res.ok) {
        setMessage({type: 'ok', text: t('created')})
        closeForm()
      } else {
        setMessage({type: 'error', text: res.error ?? t('error')})
      }
    }
  }

  const handleDeleteClick = (id: string) => {
    setConfirmDeleteId(id)
  }

  const handleDeleteConfirm = async (id: string) => {
    setDeletingId(id)
    const res = await deleteCampaign(id, locale)
    setDeletingId(null)
    setConfirmDeleteId(null)
    if (res.ok) {
      setMessage({type: 'ok', text: t('deleted')})
    } else {
      setMessage({type: 'error', text: res.error ?? t('error')})
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-foreground/80">{t('subtitle')}</p>
        <button
          type="button"
          onClick={openCreate}
          disabled={advertisers.length === 0}
          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
          {t('newCampaign')}
        </button>
      </div>

      {advertisers.length === 0 && (
        <p className="rounded-md border border-foreground/10 bg-foreground/5 px-4 py-3 text-sm text-foreground/80">
          {t('noAdvertisers')}
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

      {campaigns.length === 0 && advertisers.length > 0 ? (
        <p className="rounded-md border border-foreground/10 bg-foreground/5 px-4 py-6 text-center text-foreground/80">
          {t('noCampaigns')}
        </p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-foreground/10">
          <table className="min-w-full divide-y divide-foreground/10">
            <thead className="bg-foreground/5">
              <tr>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground/80">
                  {t('name')}
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
                  className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-foreground/80">
                  {t('totalClicks')}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-foreground/80">
                  {t('clicksLast24h')}
                </th>
                <th scope="col" className="relative px-4 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/10 bg-background">
              {campaigns.map((c) => (
                <tr key={c.id} className="hover:bg-foreground/5">
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-foreground">
                    {c.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-foreground/80">
                    {c.advertiser.name}
                  </td>
                  <td className="hidden max-w-[12rem] truncate px-4 py-3 text-sm text-foreground/80 sm:table-cell">
                    {c.clickUrl || '—'}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm tabular-nums text-foreground/80">
                    {c.totalClicks.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm tabular-nums text-foreground/80">
                    {c.clicksLast24h.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                    <button
                      type="button"
                      onClick={() => openEdit(c)}
                      className="text-foreground/80 hover:text-foreground hover:underline">
                      {t('editCampaign')}
                    </button>
                    <span className="mx-2 text-foreground/20">|</span>
                    {confirmDeleteId === c.id ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="text-foreground/60">{t('deleteConfirm')}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteConfirm(c.id)}
                          disabled={deletingId === c.id}
                          className="text-red-600 hover:underline disabled:opacity-50">
                          {t('delete')}
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
                        onClick={() => handleDeleteClick(c.id)}
                        className="text-foreground/80 hover:text-red-600 hover:underline">
                        {t('delete')}
                      </button>
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
          aria-labelledby="campaign-form-title">
          <div className="w-full max-w-md rounded-lg border border-foreground/10 bg-background p-6 shadow-xl">
            <h2 id="campaign-form-title" className="text-lg font-semibold text-foreground">
              {editingId ? t('editCampaign') : t('createCampaign')}
            </h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label htmlFor="campaign-name" className="mb-1 block text-sm font-medium text-foreground">
                  {t('name')} <span className="text-red-500">*</span>
                </label>
                <input
                  id="campaign-name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({...f, name: e.target.value}))}
                  className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/20"
                />
              </div>
              <div>
                <label htmlFor="campaign-advertiser" className="mb-1 block text-sm font-medium text-foreground">
                  {t('advertiser')} <span className="text-red-500">*</span>
                </label>
                <select
                  id="campaign-advertiser"
                  required
                  value={form.advertiserId}
                  onChange={(e) => setForm((f) => ({...f, advertiserId: e.target.value}))}
                  className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/20">
                  <option value="">—</option>
                  {advertisers.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="campaign-clickUrl" className="mb-1 block text-sm font-medium text-foreground">
                  {t('clickUrl')}
                </label>
                <input
                  id="campaign-clickUrl"
                  type="url"
                  value={form.clickUrl ?? ''}
                  onChange={(e) => setForm((f) => ({...f, clickUrl: e.target.value}))}
                  className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/20"
                />
              </div>
              <div>
                <label htmlFor="campaign-clickTag" className="mb-1 block text-sm font-medium text-foreground">
                  {t('clickTag')}
                </label>
                <input
                  id="campaign-clickTag"
                  type="text"
                  value={form.clickTag ?? ''}
                  onChange={(e) => setForm((f) => ({...f, clickTag: e.target.value}))}
                  className="w-full rounded-md border border-foreground/20 bg-background px-3 py-2 text-foreground focus:border-foreground/40 focus:outline-none focus:ring-1 focus:ring-foreground/20"
                />
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
