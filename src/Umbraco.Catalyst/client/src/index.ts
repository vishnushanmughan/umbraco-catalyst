// Import and re-export all editors.
// The @customElement decorator in each file registers the element
// with the browser's CustomElementRegistry automatically.
// Umbraco uses the elementName from umbraco-package.json to look
// up the already-registered element - no default export needed.

import "./editors/star-rating.editor";
import "./editors/cdn-image.editor";
import { emojiManifests } from "./manifest";

export const manifests = [...emojiManifests];

// Named re-exports so external code can import the classes if needed
export { CatalystStarRatingEditor } from "./editors/star-rating.editor";
export { CatalystCdnImageEditor } from "./editors/cdn-image.editor";
