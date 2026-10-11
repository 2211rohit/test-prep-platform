import type { Metadata } from 'next'

import config from '@payload-config'
import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import { importMap } from '../importMap'

export type PayloadAdminPageArgs = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

export const generatePayloadAdminMetadata = ({
  params,
  searchParams,
}: PayloadAdminPageArgs): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

export const renderPayloadAdminPage = ({ params, searchParams }: PayloadAdminPageArgs) =>
  RootPage({ config, params, searchParams, importMap })
