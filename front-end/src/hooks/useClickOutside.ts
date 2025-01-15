import React from "react";

/**
 * Hook that alerts clicks outside of the passed ref
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useClickOutside(ref: any, handleClickOutside: (event: MouseEvent) => void) {
    React.useEffect(() => {
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
}
