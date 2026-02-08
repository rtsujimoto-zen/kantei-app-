from google import genai
import os

try:
    project_id = os.environ.get("GOOGLE_CLOUD_PROJECT")
    location = os.environ.get("GOOGLE_CLOUD_REGION", "us-central1")
    
    print(f"Checking models for Project: {project_id}, Location: {location}")

    client = genai.Client(
        vertexai=True,
        project=project_id, 
        location=location
    )
    
    print("List of available models:")
    # The SDK might separate list_models or similar. 
    # Based on new SDK, usually logic is client.models.list()
    # But let's check basic ones.
    
    # Try to list using standard discovery if possible, or just print what we know works usually.
    # The unified SDK usually supports listing.
    for m in client.models.list():
        print(f"- {m.name}")

except Exception as e:
    print(f"Error: {e}")
