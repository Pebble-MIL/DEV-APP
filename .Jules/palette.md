## 2024-03-01 - Material Icons and Screen Readers
**Learning:** When using icon fonts like Material Icons where the icon is defined by text content (e.g., `<span class="material-icons">home</span>`), screen readers will literally read out the text content ("home"). This can be confusing, especially when there's an actual text label immediately following it in the DOM.
**Action:** Always add `aria-hidden="true"` to icon font elements that use text content for the icon mapping when they are accompanied by a separate visible text label.
