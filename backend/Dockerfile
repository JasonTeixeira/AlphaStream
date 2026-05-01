FROM python:3.12-slim

WORKDIR /app

# Install deps
COPY pyproject.toml .
RUN pip install --no-cache-dir pandas numpy scikit-learn xgboost lightgbm joblib \
    yfinance fastapi uvicorn pydantic python-dotenv loguru httpx

# Copy source
COPY alphastream/ alphastream/
COPY models/ models/

EXPOSE 8000

CMD ["uvicorn", "alphastream.api.server:app", "--host", "0.0.0.0", "--port", "8000"]
