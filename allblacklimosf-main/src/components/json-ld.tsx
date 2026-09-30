import React from "react";

type JsonLdProps = {
  data: object | object[];
  id?: string;
};

/**
 * Server component that emits a JSON-LD script tag.
 * Used for Organization, LocalBusiness, WebSite, WebPage,
 * Breadcrumb, FAQPage, Service, SportsEvent, BlogPosting, etc.
 */
export function JsonLd({ data, id }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      id={id}
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}
