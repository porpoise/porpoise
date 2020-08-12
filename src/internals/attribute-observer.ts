export function attributeObserver(el: HTMLElement, attributeChangedCallback: Function) {
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === "attributes") {
                const value = (mutation.target as HTMLElement).getAttribute(mutation.attributeName as string);
                attributeChangedCallback(mutation.attributeName, value);
            }
        });
    });
    observer.observe(el, { attributes: true });
}