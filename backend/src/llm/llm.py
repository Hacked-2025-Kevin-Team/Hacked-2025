import os
import configparser
import dotenv

dotenv.load_dotenv()
print(os.getenv('OPENAI_API_KEY'))


