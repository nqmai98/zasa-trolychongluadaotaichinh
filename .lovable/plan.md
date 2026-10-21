# ZASA demo completion

## Goal
Keep the working ZASA screens intact and fill gaps from the uploaded Vietnamese demo brief. All new flows stay client-side with mock data/rule-based results; no real API or payment integrations.

## Work
1. Extend role selection and shared navigation for Ông/Bà, Con cháu, and Đối tác; add a small “Bản demo” label and the partner dashboard.
2. Expand the existing check screen into message/photo, phone number, transfer safety, and QR checks, with reusable mock rules and a complete risk-result flow.
3. Complete relative consent, mock OTP, alert escalation timeline, family alert inbox, weekly report, and lesson progress summaries.
4. Add the Free/Premium comparison page and connect it from the five-tab navigation.
5. Verify the primary elder, family, and partner flows on a small viewport and check route metadata/build output.

## Technical details
- Preserve existing lesson quizzes, profiles, activity reporting, image uploads, and elder/family dashboards while adding missing flows.
- Keep mock lists and decision rules in a dedicated client-safe data module; results are explicitly illustrative, and SMS/call escalation is labeled “Dự kiến triển khai”.
- Use existing semantic design tokens and Vietnamese UI copy. Update route head metadata for every new route.