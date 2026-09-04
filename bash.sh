# BASH
# any MPP/x402 client (e.g. mppx) pays + retries automatically
mppx fetch "https://www.startuphub.ai/api/mpp/company?slug=anthropic"

# or see the raw challenge:
curl -i "https://www.startuphub.ai/api/mpp/company?slug=anthropic"
curl "https://www.startuphub.ai/.well-known/payment"
buf curl --schema . --protocol grpc \
  -H "Authorization: Bearer $XAI_API_KEY" \
  --data '{
    "text": "Hello, world!",
    "model": "grok-4.6"
  }' \
  https://api.x.ai/xai_api.Tokenize/TokenizeText

buf curl --schema . --protocol grpc \
  -H "Authorization: Bearer $XAI_API_KEY" \
  --data '{
    "model": "grok-4.6",
    "messages": [{"role": "ROLE_USER", "content": [{"text": "What is the meaning of life?"}]}]
  }' \
  https://api.x.ai/xai_api.Chat/GetCompletion
