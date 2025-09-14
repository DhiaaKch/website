import logging
from typing import Dict
from .huggingface_client import HuggingFaceClient

logger = logging.getLogger(__name__)

# Initialize the client
hf_client = HuggingFaceClient()

async def generate_ai_solution(vulnerability_data: Dict) -> str:
    """
    Generate AI-powered solution for a vulnerability using Hugging Face
    """
    try:
        return await hf_client.generate_cybersecurity_solution(vulnerability_data)
    except Exception as e:
        logger.error(f"Error generating AI solution: {str(e)}")
        return hf_client._get_fallback_solution(vulnerability_data)