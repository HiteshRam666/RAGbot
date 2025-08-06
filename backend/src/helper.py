from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader 
from langchain.text_splitter import RecursiveCharacterTextSplitter 
from langchain_openai import OpenAIEmbeddings 
from typing import List
from langchain.schema import Document 

# Extract text from pdf 
def load_pdf_files(data):
    loader = DirectoryLoader(
        data, 
        glob = "*.pdf",
        loader_cls = PyPDFLoader
    )

    documents = loader.load() 
    return documents

def filter_docs(docs: List[Document]) -> List[Document]:
    """
    Given a list of document objects, Return a new list of document objects
    containing only 'source' in metadata and the original page content
    """
    filtered_docs: List[Document] = [] 
    for doc in docs:
        src = doc.metadata.get("source")
        filtered_docs.append(
            Document(
                page_content=doc.page_content, 
                metadata = {"source": src}
            )
        )
    return filtered_docs

# Creating chunks 
def text_split(filtered_docs):
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size = 500, 
        chunk_overlap = 50
    )
    text_chunks = text_splitter.split_documents(filtered_docs)
    return text_chunks