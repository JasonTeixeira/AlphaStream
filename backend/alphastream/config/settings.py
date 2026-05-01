"""Application settings — loaded from environment variables."""

import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    # Supabase
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "")
    SUPABASE_JWT_SECRET: str = os.getenv("SUPABASE_JWT_SECRET", "")

    # Stripe
    STRIPE_SECRET_KEY: str = os.getenv("STRIPE_SECRET_KEY", "")
    STRIPE_WEBHOOK_SECRET: str = os.getenv("STRIPE_WEBHOOK_SECRET", "")

    # App
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "https://alphastream.vercel.app",
        os.getenv("FRONTEND_URL", "http://localhost:3000"),
    ]

    # Rate limits
    FREE_TIER_REQUESTS_PER_DAY: int = 50
    STARTER_REQUESTS_PER_DAY: int = 500
    PRO_REQUESTS_PER_DAY: int = 5000
    PREMIUM_REQUESTS_PER_DAY: int = 50000


settings = Settings()
