import { useCallback, useEffect, useMemo, useState } from "react";
import { BehaviorSubject, skip } from "rxjs";

export function useMediatorState<T>(
  mediator: BehaviorSubject<T>,
): [T, (state: T) => void, T] {
 
 
  const [currentValue, setCurrentValue] = useState<T>(mediator.getValue());
  const currentContextValue = useMemo(() => {
    return currentValue || mediator.getValue();
  }, [mediator, currentValue]);

  const setMediatorValue = useCallback(
    (state: T) => {
      mediator.next(state);
      setCurrentValue(state);
    },
    [mediator, setCurrentValue],
  );

  useEffect(() => {
    const subscription = mediator.pipe(skip(1)).subscribe((contextValue) => {
      setCurrentValue(contextValue);
    });
    return (): void => {
      subscription.unsubscribe();
    };
  }, [mediator]);

  return [currentValue, setMediatorValue, currentContextValue];
}
