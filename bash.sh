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

buf curl --schema . --protocol grpc \
  -H "Authorization: Bearer $XAI_API_KEY" \
  --data '{
    "model": "grok-4.6",
    "input": [
      {"role": "ROLE_SYSTEM", "content": [{"text": "You are a concise and knowledgeable science tutor."}]},
      {"role": "ROLE_USER", "content": [{"text": "What is the Higgs boson and why is it important?"}]},
      {"role": "ROLE_ASSISTANT", "content": [{"text": "The Higgs boson is an elementary particle..."}]},
      {"role": "ROLE_USER", "content": [{"text": "How does the Higgs mechanism actually work?"}]},
      {"role": "ROLE_ASSISTANT", "content": [{"text": "Through spontaneous symmetry breaking..."}]}
    ]
  }' \
  https://api.x.ai/xai_api.Chat/CompactContext
