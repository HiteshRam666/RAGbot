from fastapi import FastAPI, HTTPException 
from fastapi.middleware.cors import CORSMiddleware 
from pydantic import BaseModel, Field
from typing import Dict, List, Literal, Optional
from store_index import docsearch 
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain.chains.retrieval import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from src.prompt import prompt

app = FastAPI(
    title="Finance Bot",
    description="An API for answering finance-related questions using RAG and LLMs.",
    version="1.0.0"
)

# CORS Middleward 
app.add_middleware(
    CORSMiddleware, 
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

chat_model = ChatOpenAI(model="gpt-4o-mini")
embedding_model = OpenAIEmbeddings(model="text-embedding-3-small")

class QueryRequest(BaseModel):
    query: str = Field(..., description="The user's question about finance.")

class QueryResponse(BaseModel):
    status: str 
    answer: str 
    error: str = None

@app.get("/", tags=["Utility"])
async def root() -> Dict[str, str]:
    return {
        "message": "Welcome to the Finance Bot API!",
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health", tags=["Utility"])
async def health_check() -> Dict[str, str]:
    """Health Check Endpoint"""
    return {"status": "ok"}

@app.post("/query", response_model = QueryResponse, tags=["Query"])
async def query_docs(request: QueryRequest) -> QueryRequest:
    try:
        retriever = docsearch.as_retriever(search_type = "similarity", search_kwargs = {'k': 3})
        # docs = retriever.invoke(request.query)
        question_answering_chain = create_stuff_documents_chain(chat_model, prompt)
        rag_chain = create_retrieval_chain(retriever, question_answering_chain)
        response = rag_chain.invoke({"input": request.query})
        return QueryResponse(status="success", answer=response["answer"])
    except Exception as e:
        # Log the error here if you have a logger
        return QueryResponse(status="error", answer="", error=str(e))
