# BarayPay Architecture

## Core Design

- Core package defines provider contract and normalized types.
- Provider packages map provider-native payloads into BarayPay unified models.
- Client dispatches method calls to provider adapters by `provider` key.

## Provider Lifecycle

1. Developer registers providers with `createBarayPay`.
2. Unified methods route to provider adapter.
3. Adapter performs signing/http/parsing.
4. Adapter returns normalized output.

## Security Principles

- Server-side usage only for merchant secrets.
- Raw-body webhook verification.
- No secret handling in browser runtime.

## Ecosystem Direction

- Keep SDK stable and provider packages independently versionable.
- Follow the pattern of Stripe (stable API), Passport (pluggable strategy), Better Auth (developer experience focus).
