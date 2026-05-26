import { useCallback, useEffect, useRef } from 'react';

export function useElementHeight<T extends HTMLDivElement = HTMLDivElement>(
    cssVariableName: string,
    attachToParentWithId: string,
    fallbackValue?: string,
    strict?: boolean,
): React.RefObject<T|null> {
    const ref = useRef<T>(null);
    const onResize = useCallback((): void => {
        if (ref.current) {
            let height = (ref.current as HTMLDivElement).clientHeight || 0;
            if (!height && !strict) {
                height = ((ref.current as HTMLDivElement).firstChild as HTMLDivElement).clientHeight || 0;
            }

            document.getElementById(attachToParentWithId)?.style.setProperty(cssVariableName, `${height}px`);
        } else {
            document.getElementById(attachToParentWithId)?.style.setProperty(cssVariableName, fallbackValue ?? `0px`);
        }
    }, []);

    useEffect(() => {
        window.removeEventListener('resize', onResize);
        window.addEventListener('resize', onResize);
        onResize();
        return (): void => {
            window.removeEventListener('resize', onResize);
        };
    }, [onResize]);

    return ref;
}
