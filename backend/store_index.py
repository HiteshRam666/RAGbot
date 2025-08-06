import os
from dotenv import load_dotenv
from src.helper import load_pdf_files, filter_docs, text_split
from pinecone import Pinecone 
from langchain_pinecone import PineconeVectorStore
from langchain_openai import OpenAIEmbeddings
from pinecone import ServerlessSpec

load_dotenv()

openai = os.environ.get("OPENAI_API_KEY")
pinecone = os.environ.get("PINECONE_API_KEY")

os.environ["OPENAI_API_KEY"] = openai 
os.environ["PINECONE_API_KEY"] = pinecone

extracted_data = load_pdf_files(data = "C:\\Users\\hites\\OneDrive\\Desktop\\Bot\\data")
filtered_data = filter_docs(extracted_data)
text_chunks = text_split(filtered_data)

embedding_model = OpenAIEmbeddings(model="text-embedding-3-small")

pc = Pinecone(api_key=pinecone)

index_name = "finance-bot"

# if not pc.has_index(index_name):
#     pc.create_index(
#         name = index_name, 
#         dimension=1536, # Dim of the embedding 
#         metric="cosine", # Cosine similarity
#         spec=ServerlessSpec(cloud="aws", region="us-east-1")
#     )

docsearch = PineconeVectorStore.from_existing_index(
    index_name= index_name, 
    embedding=embedding_model
)

retriever = docsearch.as_retriever(search_type = "similarity", search_kwargs = {'k': 3})
