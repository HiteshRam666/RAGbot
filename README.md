# 🤖 Finance RAG Assistant

A sophisticated Retrieval-Augmented Generation (RAG) application that provides intelligent financial advice and answers to finance-related questions using advanced AI technology.

[Click for demo]: https://finance-rag-4zel.onrender.com/app

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

The AI Finance RAG Assistant is a cutting-edge application that combines the power of Large Language Models (LLMs) with Retrieval-Augmented Generation to provide accurate, context-aware financial advice. The system processes financial documents, creates embeddings, stores them in a vector database, and retrieves relevant information to generate intelligent responses to user queries.

### How It Works

1. **Document Processing**: PDF financial documents are loaded and processed  
2. **Text Chunking**: Documents are split into manageable chunks for better retrieval  
3. **Embedding Generation**: Text chunks are converted to vector embeddings using OpenAI  
4. **Vector Storage**: Embeddings are stored in Pinecone vector database  
5. **Query Processing**: User queries are processed and matched against stored embeddings  
6. **Response Generation**: Relevant context is retrieved and used to generate accurate answers  

## ✨ Features

- 🤖 Intelligent Financial Assistant (GPT-4 Mini)  
- 📚 PDF Document Processing  
- 🔍 Semantic Search via Pinecone  
- 💬 Real-time Chat Interface  
- 🌐 RESTful API for programmatic access  
- 📱 Mobile-Friendly Design  
- ⚡ Fast, Lightweight, and Scalable  
- 🔒 Secure with `.env` Configs  

## 🛠️ Technology Stack

**Backend:**
- Python 3.11+  
- FastAPI  
- LangChain  
- OpenAI API  
- Pinecone Vector DB  
- PyPDF  
- Uvicorn  

**Frontend:**
- HTML5, CSS3  
- JavaScript (ES6+)  
- Font Awesome  

**Infrastructure:**
- Render.com for deployment  
- `.env` for secure configuration  

## 🚀 Installation

### Prerequisites

- Python 3.11+  
- OpenAI API Key  
- Pinecone API Key  

### Clone the Repository

```bash
git clone https://github.com/yourusername/finance-rag-app.git
cd finance-rag-app
```

### Set Up Virtual Environment

```bash
python -m venv venv
# Activate:
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Create `.env` File

```env
OPENAI_API_KEY=your_openai_key
PINECONE_API_KEY=your_pinecone_key
```

### Add Financial Documents

Place your PDF files in the `data/` folder:

```
data/
├── Encyclopedia_finance.pdf
└── other_financial_documents.pdf
```

### Index Documents

```bash
python backend/store_index.py
```

### Run the App

```bash
uvicorn backend.app:app --reload --host 0.0.0.0 --port 8000
```

Visit: [http://localhost:8000](http://localhost:8000)

## ⚙️ Configuration

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API Key | ✅ |
| `PINECONE_API_KEY` | Pinecone API Key | ✅ |

### Defaults:

- Embedding Model: `text-embedding-3-small`  
- LLM Model: `gpt-4o-mini`  
- Chunk Size: 500 chars  
- Chunk Overlap: 50  
- Top K: 3 docs  

## 📖 Usage

### Web Interface

1. Open in browser: `http://localhost:8000`  
2. Ask any finance-related question  
3. Get instant answers with document-backed context  

### Sample Questions

- What is compound interest?  
- How do I calculate ROI?  
- What are financial statements?  

### API Example

```bash
curl -X POST "http://localhost:8000/query" \
     -H "Content-Type: application/json" \
     -d '{"query": "Explain balance sheet"}'
```

## 📚 API Endpoints

| Method | Endpoint       | Description                     |
|--------|----------------|---------------------------------|
| GET    | `/`            | Welcome message                 |
| GET    | `/health`      | Health check                    |
| GET    | `/app`         | Web chat interface              |
| POST   | `/query`       | Submit financial query          |

### Example Request

```json
{
  "query": "What are the types of assets in accounting?"
}
```

## 🚀 Deployment

### Render

1. Push repo to GitHub  
2. Connect repo to Render  
3. Add environment variables  
4. Set start command:  
```bash
uvicorn backend.app:app --host 0.0.0.0 --port 10000
```

### Docker (Optional)

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .

EXPOSE 8000
CMD ["uvicorn", "backend.app:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 📁 Project Structure

```
finance-rag-app/
├── backend/
│   ├── app.py
│   ├── store_index.py
│   └── src/
│       ├── helper.py
│       └── prompt.py
├── data/
│   └── Encyclopedia_finance.pdf
├── frontend/
│   ├── index.html
│   └── app.js
├── research/
│   └── trials.ipynb
├── requirements.txt
├── render.yaml
└── README.md
```

## 🧠 Development Tips

### Add More PDFs

1. Drop them into `data/`  
2. Re-run: `python backend/store_index.py`  

### Customize Prompts

Edit `backend/src/prompt.py`:

```python
system_prompt = (
    "You are a knowledgeable and reliable Financial Assistant..."
)
```

### Extend App

- New loaders → `helper.py`  
- Add APIs → `app.py`  
- UI tweaks → `frontend/index.html`  

## 🤝 Contributing

1. Fork the repo  
2. Create a feature branch  
3. Push your changes  
4. Submit a Pull Request 🚀  

## 🙏 Acknowledgments

- [OpenAI](https://openai.com)  
- [Pinecone](https://www.pinecone.io)  
- [FastAPI](https://fastapi.tiangolo.com)  
- [LangChain](https://www.langchain.com)  

---

**Built with ❤️ to make finance accessible through AI.**
