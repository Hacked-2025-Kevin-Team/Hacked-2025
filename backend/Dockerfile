FROM python:3.11

# Set the working directory
WORKDIR /app

# Install Poetry
RUN pip install --no-cache-dir poetry

# Copy project files
COPY pyproject.toml poetry.lock ./

ENV POETRY_VIRTUALENVS_IN_PROJECT=false

# Install dependencies with Poetry 
RUN poetry install --no-root 

ENV NCBI_API_KEY=5e477ca31aafaa57067b087c9805d8204508

# Copy the source code
COPY src ./src

# Set the entrypoint to run main.py
CMD ["poetry", "run", "python", "src/main.py"]