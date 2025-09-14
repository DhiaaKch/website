import requests
import logging
from typing import Dict, Optional
from decouple import config

logger = logging.getLogger(__name__)

class HuggingFaceClient:
    def __init__(self):
        self.api_key = config("HF_API_KEY", default="")
        self.headers = {"Authorization": f"Bearer {self.api_key}"} if self.api_key else {}
        self.base_url = "https://api-inference.huggingface.co/models"
        
    async def generate_cybersecurity_solution(self, vulnerability_data: Dict) -> str:
        """
        Generate AI-powered solution for a vulnerability using Hugging Face
        """
        model_name = "mistralai/Mistral-7B-Instruct-v0.2"  # Free model
        
        prompt = self._build_prompt(vulnerability_data)
        
        try:
            response = await self._query_model(model_name, prompt)
            return self._parse_response(response)
            
        except Exception as e:
            logger.error(f"Hugging Face API error: {str(e)}")
            return self._get_fallback_solution(vulnerability_data)
    
    def _build_prompt(self, vulnerability_data: Dict) -> str:
        """Build the prompt for the AI model"""
        return f"""<s>[INST]As a cybersecurity expert, provide a detailed solution for this vulnerability:

Vulnerability Name: {vulnerability_data.get('name', 'Unknown')}
Severity: {vulnerability_data.get('severity', 'Unknown')}
Description: {vulnerability_data.get('description', 'No description available')}
Host: {vulnerability_data.get('host', 'Unknown')}

Please provide:
1. A brief explanation of the vulnerability
2. Step-by-step remediation instructions
3. Best practices to prevent this vulnerability
4. Any relevant references

Keep the response concise but comprehensive.[/INST]</s>"""
    
    async def _query_model(self, model_name: str, prompt: str) -> Dict:
        """Query the Hugging Face model"""
        import aiohttp
        import asyncio
        
        url = f"{self.base_url}/{model_name}"
        
        payload = {
            "inputs": prompt,
            "parameters": {
                "max_new_tokens": 400,
                "temperature": 0.7,
                "do_sample": True,
                "return_full_text": False
            },
            "options": {
                "wait_for_model": True,
                "use_cache": True
            }
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(
                url, 
                headers=self.headers, 
                json=payload,
                timeout=30
            ) as response:
                if response.status == 200:
                    return await response.json()
                elif response.status == 503:
                    # Model is loading, wait and retry
                    await asyncio.sleep(10)
                    async with session.post(url, headers=self.headers, json=payload) as retry_response:
                        return await retry_response.json()
                else:
                    raise Exception(f"API error: {response.status}")
    
    def _parse_response(self, response: Dict) -> str:
        """Parse the model response"""
        if isinstance(response, list) and len(response) > 0:
            return response[0].get('generated_text', '').strip()
        elif isinstance(response, dict) and 'generated_text' in response:
            return response['generated_text'].strip()
        else:
            raise Exception("Unexpected response format")
    
    def _get_fallback_solution(self, vulnerability_data: Dict) -> str:
        """Fallback solution if AI fails"""
        name = vulnerability_data.get('name', 'the vulnerability')
        return f"""Recommended solution for {name}:

1. Review the vulnerability details and assess the impact on your system
2. Check for available patches or updates for the affected component
3. Implement proper input validation and output encoding
4. Follow the principle of least privilege for access controls
5. Consult OWASP guidelines and official documentation
6. Conduct security testing to verify the remediation

Note: For specific guidance, consult cybersecurity resources and vulnerability databases."""