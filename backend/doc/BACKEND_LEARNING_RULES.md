# Backend Learning Rules

This document controls how backend changes are taught and applied for CaseBound.

## Manual implementation workflow

- Do not make backend implementation changes directly unless the developer explicitly asks for the files to be changed.
- For each backend requirement, provide small, ordered steps instead of a complete large implementation.
- Each step must state the command to run, exact file to create or update, required imports, copy-paste code, and a concise explanation of the code flow.
- The developer manually applies and reviews each step before proceeding to the next one.
- Explain NestJS concepts in plain language, including the responsibility of each module, controller, service, DTO, schema, guard, and provider involved.
- Keep security controls in place while teaching. Never use hard-coded secrets, disable validation, bypass authorization, or add insecure shortcuts merely to simplify a lesson.

## Suggested lesson sequence

1. Explain the API flow and files before editing.
2. Create one module or small unit at a time.
3. Compile and test the completed step.
4. Review the result and then continue.
