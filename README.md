# n8n to Figma Prompt Relay

I use this to send JSON from an n8n workflow for creative discovery into Figma via a relay server. This was created in an attempt to automate as much of the discovery process as possible, given that Figma has not exposed an API endpoint for the Make prompt field yet. The plugin displays the copy when the flow runs, which can then be copied and pasted into the Make prompt input. This keeps non-tehcnical users oout of n8n and in their design tools. 

## Setup
1. Create an HTTP request in n8n. Method: POST, URL is where you're hosting the service (I'm using Render). Add your header and JSON, which should contain the JSON you want to pass to Figma.
2. Update the plugin's ui.html file with your SSE connection (Render URL).
3. Deploy the server (Render)
4. Run the Figma plugin.
5. Run your n8n flow.

## Payload
```json
{ "prompt": "Text from Figma", "userId": "me" }
```

## Security
- Webhook URLs are public, rotate if leaked
- Use HTTPS
- Don’t store secrets in Figma code
- Add header auth if needed

## Toolchain
- Figma
- n8n
- SSE
- Render
