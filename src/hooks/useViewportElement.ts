import { useEffect, useState } from 'react';

/**
 * Custom hook to detect if a given element (by ID) is in the viewport
 * and update an attribute on a target element.
 *
 * @param elementId The ID of the DOM element to observe.
 * @param attributeName The attribute name to set (e.g., 'footerVisible').
 * @param attachToParentWithId The ID of the element where the attribute will be written.
 * @param threshold A number between 0 and 1.
 * @returns A boolean indicating the current visibility state.
 */
export function useViewportElement(
  elementId: string,
  attributeName: string,
  attachToParentWithId: string,
  threshold: number = 0.1
): boolean {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        document.getElementById(attachToParentWithId)?.setAttribute(attributeName, entry.isIntersecting ? 'true' : 'false');
      },
      { threshold }
    );

    const element = document.getElementById(elementId);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [elementId, attributeName, attachToParentWithId, threshold]);

  return isVisible;
}