import { Pinecone } from "@pinecone-database/pinecone"

const apiKey = process.env.PINECONE_API_KEY;

if(!apiKey) {
  throw Error("OPEN_AI_KEY is required")
};

const pinecone = new Pinecone({
  apiKey,
});

export const notesIndex = pinecone.Index("fa-ai")