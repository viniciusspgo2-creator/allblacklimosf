"use client";

import { useState } from "react";

type FaqItem = {
  question: string;
  answer: string;
};

type Props = {
  items: Array<[string, string]> | FaqItem[];
  /** Index of the item that should be open by default (default: 0) */
  defaultOpen?: number;
};

/**
 * Accessible FAQ accordion with proper React state management.
 * Only one item can be open at a time. Keyboard accessible.
 */
export function FaqAccordion({ items, defaultOpen = 0 }: Props) {
  const [openIndex, setOpenIndex] = useState<number>(defaultOpen);

  const faqItems: FaqItem[] = items.map((item) => {
    if (Array.isArray(item)) {
      return { question: item[0], answer: item[1] };
    }
    return item;
  });

  return (
    <div className="faq-list" data-accordion>
      {faqItems.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <article
            key={index}
            className={`faq-item${isOpen ? " is-open" : ""}`}
          >
            <button
              className="faq-question"
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
            >
              <span>{item.question}</span>
              <i className="fa-solid fa-plus" aria-hidden="true" />
            </button>
            <div className="faq-answer">
              <div>
                <p>{item.answer}</p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
