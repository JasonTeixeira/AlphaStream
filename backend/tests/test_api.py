"""Tests for FastAPI endpoints."""
import os
os.environ.setdefault("SUPABASE_URL", "")
os.environ.setdefault("SUPABASE_KEY", "")
os.environ.setdefault("SUPABASE_JWT_SECRET", "test-secret")

import pytest

def _get_client():
    """Create test client — skip if httpx version incompatible."""
    try:
        from starlette.testclient import TestClient
        from alphastream.api.server import app
        return TestClient(app)
    except TypeError:
        pytest.skip("httpx/starlette version mismatch for TestClient")

def test_health():
    c = _get_client()
    r = c.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"

def test_signals_requires_auth():
    c = _get_client()
    assert c.get("/v1/signals").status_code == 401

def test_models_requires_auth():
    c = _get_client()
    assert c.get("/v1/models").status_code == 401

def test_backtest_requires_auth():
    c = _get_client()
    assert c.post("/v1/backtest", json={"symbol": "ES"}).status_code == 401
