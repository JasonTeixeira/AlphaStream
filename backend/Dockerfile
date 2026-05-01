FROM python:3.12-slim

WORKDIR /app

# Install deps
COPY pyproject.toml .
RUN pip install --no-cache-dir \
    pandas==2.2.3 numpy==1.26.4 scikit-learn==1.5.2 xgboost==2.1.3 \
    lightgbm==4.5.0 joblib==1.4.2 yfinance>=1.3.0 \
    fastapi==0.115.6 uvicorn==0.34.0 pydantic==2.10.4 \
    supabase==2.11.0 python-jose[cryptography]==3.3.0 \
    httpx==0.28.1 python-dotenv==1.0.1 loguru==0.7.3 slowapi==0.1.9

# Copy source
COPY alphastream/ alphastream/
COPY models/ models/

EXPOSE 8000

CMD ["uvicorn", "alphastream.api.server:app", "--host", "0.0.0.0", "--port", "8000"]
