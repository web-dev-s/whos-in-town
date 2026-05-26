import { useEffect, useRef } from 'react';

export function useElementHeight<T extends HTMLElement = HTMLDivElement>(
    cssVariableName: string,
    attachToParentWithId: string,
    fallbackValue?: string,
    strict?: boolean,
): React.RefObject<T | null> {
    const ref = useRef<T>(null);

    useEffect(() => {
        const updateHeight = () => {
            const target = ref.current;
            if (!target) {
                document.getElementById(attachToParentWithId)?.style.setProperty(cssVariableName, fallbackValue ?? `0px`);
                return;
            }

            let height = target.clientHeight || 0;
            if (!height && !strict && target.firstChild instanceof HTMLElement) {
                height = target.firstChild.clientHeight || 0;
            }

            document.getElementById(attachToParentWithId)?.style.setProperty(cssVariableName, `${height}px`);
        };

        const observer = new ResizeObserver(updateHeight);
        if (ref.current) observer.observe(ref.current);
        updateHeight(); // Initial set

        return () => observer.disconnect();
    }, [cssVariableName, attachToParentWithId, fallbackValue, strict]);

    return ref;
}
