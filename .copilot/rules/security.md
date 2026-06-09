# Client-Side Security Directives

## 1. Input Sanitization
* Render data safely using native React string parameters to mitigate common Cross-Site Scripting (XSS) risks. 
* Do not introduce direct DOM injections like `dangerouslySetInnerHTML` unless explicitly sanitized.

## 2. Transport Protocol Standard
* Configure API client instances to communicate solely using HTTPS endpoints.
* Strip sensitive credentials or raw token representations from persistent cache structures like `localStorage`. Use short-lived memory references for secure contextual indicators.