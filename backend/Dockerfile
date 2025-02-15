FROM python:3.11

# Set the working directory
WORKDIR /app

# Install Poetry
RUN pip install --no-cache-dir poetry

# Copy project files
COPY pyproject.toml poetry.lock ./

# Install dependencies with Poetry
RUN poetry install

# Copy the source code
COPY src ./src

# Set the entrypoint to run main.py
CMD ["poetry", "run", "python", "src/main.py"]