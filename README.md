## Dev locally

```
npm i
env-cmd npx functions-framework --target=events
```

## Deploy

```
gcloud functions deploy events \
--allow-unauthenticated \
--runtime=nodejs18 \
--update-env-vars TYPESENSE_API_KEY=PASTE_KEY_HERE \
--trigger-http
```
