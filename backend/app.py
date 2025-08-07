from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from typing import Dict, Any, Optional
from backend.store_index import docsearch
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain.chains.retrieval import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from backend.src.prompt import prompt
import os
import logging
from pathlib import Path

# Initialize logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables if needed
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Initialize FastAPI app
app = FastAPI(
    title="Finance Bot API",
    description="An API for answering finance-related questions using RAG and LLMs.",
    version="1.0.0"
)

# Enable CORS (allow all for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Get the current directory and find frontend
current_dir = Path(__file__).parent
frontend_dir = current_dir.parent / "frontend"

# Serve static files from frontend directory if it exists
if frontend_dir.exists():
    app.mount("/static", StaticFiles(directory=str(frontend_dir)), name="static")

# Initialize models
chat_model = ChatOpenAI(model="gpt-4o-mini")
embedding_model = OpenAIEmbeddings(model="text-embedding-3-small")

# --- Models ---
class QueryRequest(BaseModel):
    query: str = Field(..., example="What are the main types of financial statements?", description="User's finance-related query")

class QueryResponse(BaseModel):
    status: str = Field(..., example="success")
    answer: str = Field(..., example="The main financial statements are income statement, balance sheet, and cash flow statement.")
    error: Optional[str] = Field(default=None, example="None")

# --- Routes ---
@app.get("/", tags=["Root"])
async def root() -> Dict[str, Any]:
    """Welcome endpoint with available routes"""
    return {
        "message": "Welcome to Finance Bot API 🚀",
        "version": "1.0.0",
        "routes": {
            "health": "/health",
            "query": "/query",
            "docs": "/docs"
        }
    }

@app.get("/health", tags=["Utility"])
async def health_check() -> Dict[str, str]:
    """Health check for uptime monitoring"""
    return {"status": "ok"}

@app.post("/query", response_model=QueryResponse, tags=["Query"], status_code=status.HTTP_200_OK)
async def query_docs(request: QueryRequest) -> QueryResponse:
    """Handles finance-related queries using RAG pipeline"""
    try:
        # Build retrieval chain
        retriever = docsearch.as_retriever(search_type="similarity", search_kwargs={"k": 3})
        qa_chain = create_stuff_documents_chain(chat_model, prompt)
        rag_chain = create_retrieval_chain(retriever, qa_chain)

        # Run RAG
        response = rag_chain.invoke({"input": request.query})

        return QueryResponse(
            status="success",
            answer=response.get("answer", "No answer returned from model."),
            error=None
        )

    except Exception as e:
        logger.error(f"Query failed: {e}")
        return QueryResponse(
            status="error",
            answer="",
            error=str(e)
        )

# Serve the frontend
@app.get("/app")
async def serve_frontend():
    if frontend_dir.exists():
        return FileResponse(str(frontend_dir / "index.html"))
    else:
        return {"error": "Frontend not found"}

@app.get("/app.js")
async def serve_js():
    if frontend_dir.exists():
        return FileResponse(str(frontend_dir / "app.js"))
    else:
        return {"error": "Frontend JS not found"}