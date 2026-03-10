'use client'

import React, {useState} from 'react'
import {useTranslations} from 'next-intl'
import {
  createAdvertiser,
  updateAdvertiser,
  deleteAdvertiser,
  type AdvertiserInput,
} from './actions'

type Advertiser = {
  id: string
  name: string
  campaignCount: number
}

type AdvertisersCrudProps = {
  advertisers: Advertiser[]
  locale: string
}

const emptyForm: AdvertiserInput = {
  name: '',
}

export function AdvertisersCrud({
  advertisers,
  locale,
}: AdvertisersCrudProps): React.ReactElement {
  const t = useTranslations('AdvertisersPage')
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<AdvertiserInput>(emptyForm)
  const [message, setMessage] = useState<{type: 'ok' | 'error'; text: string} | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm)
    setFormOpen(true)
    setMessage(null)
  }

  const openEdit = (a: Advertiser) => {
    setEditingId(a.id)
    setForm({name: a.name})
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
    if (!form.name.trim()) {
      setMessage({type: 'error', text: t('error')})
      return
    }
    const payload: AdvertiserInput = {name: form.name.trim()}
    if (editingId) {
      const res = await updateAdvertiser(editingId, payload, locale)
      if (res.ok) {
        setMessage({type: 'ok', text: t('updated')})
        closeForm()
      } else {
        setMessage({type: 'error', text: res.error ?? t('error')})
      }
    } else {
      const res = await createAdvertiser(payload, locale)
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
    const res = await deleteAdvertiser(id, locale)
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
          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
          {t('newAdvertiser')}
        </button>
      </div>

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

      {advertisers.length === 0 ? (
        <p className="rounded-md border border-foreground/10 bg-foreground/5 px-4 py-6 text-center text-foreground/80">
          {t('noAdvertisers')}
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
                  className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-foreground/80">
                  {t('campaigns')}
                </th>
                <th scope="col" className="relative px-4 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-foreground/10 bg-background">
              {advertisers.map((a) => (
                <tr key={a.id} className="hover:bg-foreground/5">
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-foreground">
                    {a.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm tabular-nums text-foreground/80">
                    {a.campaignCount.toLocaleString()}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm">
                    <button
                      type="button"
                      onClick={() => openEdit(a)}
                      className="text-foreground/80 hover:text-foreground hover:underline">
                      {t('editAdvertiser')}
                    </button>
                    <span className="mx-2 text-foreground/20">|</span>
                    {confirmDeleteId === a.id ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="text-foreground/60">{t('deleteConfirm')}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteConfirm(a.id)}
                          disabled={deletingId === a.id}
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
                        onClick={() => handleDeleteClick(a.id)}
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
          aria-labelledby="advertiser-form-title">
          <div className="w-full max-w-md rounded-lg border border-foreground/10 bg-background p-6 shadow-xl">
            <h2 id="advertiser-form-title" className="text-lg font-semibold text-foreground">
              {editingId ? t('editAdvertiser') : t('createAdvertiser')}
            </h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label htmlFor="advertiser-name" className="mb-1 block text-sm font-medium text-foreground">
                  {t('name')} <span className="text-red-500">*</span>
                </label>
                <input
                  id="advertiser-name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({...f, name: e.target.value}))}
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
