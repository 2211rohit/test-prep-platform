import type { Metadata } from 'next'

import config from '@payload-config'
import { NotFoundPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../importMap'

export type PayloadAdminNotFoundArgs = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generatePayloadNotFoundMetadata = ({
  params,
  searchParams,
}: PayloadAdminNotFoundArgs): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

export const renderPayloadAdminNotFound = ({ params, searchParams }: PayloadAdminNotFoundArgs) =>
  NotFoundPage({ config, params, searchParams, importMap })
