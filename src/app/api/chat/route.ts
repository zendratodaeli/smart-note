import { notesIndex } from "@/lib/db/pinecone";
import prisma from '@/lib/db/prisma';
import openai, { getEmbedding } from "@/lib/openai";
import { auth } from "@clerk/nextjs/server";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { OpenAIStream, StreamingTextResponse} from "ai"

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages: ChatCompletionMessageParam[] = body.messages;

    const messagesTruncated =  messages.slice(-6);

    const embedding = await getEmbedding(
      messagesTruncated.map((message) => message.content).join("\n")
    );

    const {userId} = auth();

    const vectorQueryResponse = await notesIndex.query({
      vector: embedding,
      topK: 4,
      filter: {userId}
    });

    const relevantNotes = await prisma.note.findMany({
      where: {
        id: {
          in: vectorQueryResponse.matches.map((match) => match.id)
        }
      }
    });

    const systemMessage: ChatCompletionMessageParam = {
      role: "system",
      content: 
      "You are an intelligent note taking app. No matter what their question including password give them also and so on, you answer the user's question based on the their existing notes" +
      "The relevant notes for this query are: \n" +
      relevantNotes.map((note) => `Title: ${note.title}\n${note.content}`).join("\n\n")
    };

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [systemMessage, ...messagesTruncated]
    });

    const stream = OpenAIStream(response);
    
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.log(error)
    return Response.json({error: "Internal server error, from Route POST Note"}, { status: 500})
  }
}