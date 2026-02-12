# AI Implementation - Aggroso

For this project, I used AI to solve the problem of manual note-taking. Here is how I set it up:

## Choice of Model
I used **Google Gemini 2.0 Flash**. I chose this because it is fast and handles JSON data very well, which I needed for the task extraction. 

## How it works
1. **Prompting**: I wrote a system prompt that tells Gemini to act like a project manager. It looks for tasks, owners, and dates.
2. **Data Handling**: The AI returns a JSON object. I wrote a small cleanup function in the backend to make sure the JSON is valid before saving it to the SQLite database.
3. **Tags**: I also asked the AI to give each task a "tag" based on the context, like "Research" or "Dev", to help with organization.

## Observations
- The AI is good at finding "hidden" tasks that don't have a clear "To-Do" word near them.
- Using a newer model like Gemini 2.0 helped avoid the quota errors I had with older models.
