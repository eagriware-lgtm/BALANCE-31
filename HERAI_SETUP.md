# HerAI setup (site owner)

HerAI uses a Vercel serverless function at `/api/herai` and the OpenAI Responses API. The browser never receives the API key.

## Required setup

1. Deploy this repository as a Vercel project.
2. In the Vercel project settings, add an environment variable named `OPENAI_API_KEY`.
3. Set its value to an OpenAI API key owned and managed by the responsible adult/site owner. Keep it private; never put it in `index.html`, GitHub source, or a public `.env` file.
4. Enable it for the deployment environments you use, then redeploy.
5. Test HerAI with a non-sensitive example. Do not test with anyone's real medical history.

## Important

- API usage may incur charges. The responsible adult/site owner should review usage limits and billing before enabling it.
- The HerAI form asks for consent because the submitted message is sent to OpenAI to generate a reply. Users should not submit names, contact details, or other identifying information.
- HerAI is an educational information assistant, not a medical service. It must not diagnose, prescribe, or replace a qualified healthcare professional.
- The endpoint limits message length and does not intentionally save messages in this site's code. The AI provider's data handling is governed by its own current policies and account settings; do not promise users that health information is never retained.
- This project is not a substitute for a privacy review, clinical review, or legal review before public use.
