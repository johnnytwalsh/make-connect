# n8n to Figma Prompt Relay

I use this to send JSON from an n8n workflow for creative discovery into Figma via a relay server. This was created in an attempt to automate as much of the discovery process as possible, given that Figma has not exposed an API endpoint for the Make prompt yet. The plugin displays the copy that is the result of an n8n automated workflow.

## Setup
1. Create **Custom Webhook** and copy the URL
2. Add it to `server.js`:
   ```js
   const MAKE_WEBHOOK = "https://hook.make.com/...";
   ```
3. Deploy the server (Render/Railway/etc)
4. Update Figma plugin:
   ```js
   fetch("https://your-server.onrender.com/to-make")
   ```
5. Run the Figma plugin.

## Payload
```json
{ "prompt": "Text from Figma", "userId": "me" }
```

## Security
- Webhook URLs are public, rotate if leaked
- Use HTTPS
- Don’t store secrets in Figma code
- Add header auth if needed
