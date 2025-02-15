FROM python:3.11-slim

# Set environment variables
ENV POETRY_VERSION=1.8.2 \
    PYTHONUNBUFFERED=1 \
    POETRY_VIRTUALENVS_IN_PROJECT=true \
    POETRY_NO_INTERACTION=1

# Install Poetry
RUN pip install --no-cache-dir poetry==${POETRY_VERSION}

# Set working directory
WORKDIR /app

# Copy pyproject.toml and poetry.lock first (for better caching)
COPY pyproject.toml poetry.lock ./

# Install dependencies
RUN poetry install

# Copy the source code
COPY src/ src/

# Run the application
CMD ["poetry", "run", "python", "src/main.py"]