# Core Orchestration Blueprint

This file serves as the definitive reference point for building and maintaining the Chubb APAC Policy Overview Dashboard. Any AI agent, LLM assistant, or developer working within this project must strictly adhere to the integrated rule systems linked below.

## 1. Context Injection Framework
Before initiating any generation, development, or refactoring tasks, you must completely analyze the underlying application constraints:
* **Target Objective:** Synthesize requirements according to the guidelines outlined in [.copilot/context/requirements.md](context/requirements.md).
* **Stack Alignment:** Enforce the exact tech stack limits specified in [.copilot/context/tech-stack.md](context/tech-stack.md).
* **Architecture History:** Maintain continuity with past design decisions documented in [.copilot/context/ai-journal.md](context/ai-journal.md).

## 2. Architectural & Quality Execution Guardrails
When writing components, custom hooks, or test specifications, your output must completely conform to these explicit rule structures:
* **Functional Logic & Formatting:** Adhere to the core styling and layout rules defined in [.copilot/rules/react-coding-standards.md](rules/react-coding-standards.md) and [.copilot/rules/styling.md](rules/styling.md).
* **Directory Isolation:** Enforce the folder segregation policies outlined in [.copilot/rules/architecture.md](rules/architecture.md).
* **State Management Limits:** Differentiate and manage state according to the separation of concerns detailed in [.copilot/rules/components-services-state.md](rules/components-services-state.md) and [.copilot/rules/storage.md](rules/storage.md).
* **User Resilience & Accessibility:** Validate user interaction surfaces against the access and recovery standards specified in [.copilot/rules/accessibility.md](rules/accessibility.md) and [.copilot/rules/error-handling.md](rules/error-handling.md).
* **Data Presentation & Verification:** Normalize data display fields and verify changes using the processes described in [.copilot/rules/i18n.md](rules/i18n.md) and [.copilot/rules/testing.md](rules/testing.md).
* **Security & System Telemetry:** Structure internal diagnostics and data boundaries to match the patterns defined in [.copilot/rules/security.md](rules/security.md) and [.copilot/rules/logging.md](rules/logging.md).

## 3. Pre-Generation Compliance Check
Prior to returning any code block, evaluate your solution against this prompt checklist:
1. *Is this implementation written in pure JavaScript, utilizing the exact `.js` or `.jsx` file extensions specified?*
2. *Does this design bypass heavy global client state stores like Redux or Context, leaning instead on React Query and URL search params?*
3. *Are all interactive components built with semantic HTML elements and accessible ARIA labeling?*

If any criteria are not fully met, revise the implementation to match the rules before rendering output.