import { notesIndex } from "@/lib/db/pinecone";
import { getEmbedding } from "@/lib/openai";
import { createNoteSchema, deleteNoteSchema, updatedNoteSchema } from "@/lib/validation/note";
import { auth } from "@clerk/nextjs/server";
import prisma from '@/lib/db/prisma';
import { useOrganization } from "@clerk/nextjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parseResult = createNoteSchema.safeParse(body);
    
    
    if(!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({error: "Invalid input"}, {status: 400})
    }
    
    const {title, content, organizationId, memberId} = parseResult.data;
    
    const {userId} = auth();

    if(!userId) {
      return Response.json({error: "Unauthorized"}, { status: 401})
    }

    const embedding = await getEmbeddingForNote(title, content);

    const note = await prisma.$transaction(async (tx) => {
      const note = await tx.note.create({
        data: {
          title, content, userId, organizationId, memberId
        }
      });

      await notesIndex.upsert([
        {
          id: note.id,
          values: embedding,
          metadata: { userId }
        }
      ]);

      return note;
    })


    return Response.json({ note }, { status: 201 })
  } catch (error) {
    console.log(error)
    return Response.json({error: "Internal server error, from Route POST Note"}, { status: 500})
  }
};

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const parseResult = updatedNoteSchema.safeParse(body);
    
    if(!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({error: "Invalid input"}, {status: 400})
    }
    
    const {id, title, content} = parseResult.data;

    const {userId} = auth();

    const note = await prisma.note.findUnique({
      where: { id }
    });

    if(!note) {
      return Response.json({error: "Not Found"}, { status: 404})
    }

    if(!userId || userId !== note.userId) {
      return Response.json({error: "Unauthorized"}, { status: 401})
    }

    const embedding = await getEmbeddingForNote(title, content);

    const updatedNote = await prisma.$transaction(async (tx) => {
      const updatedNote = await tx.note.update({
        where: { id },
        data: {
          title, content
        }
      });

      await notesIndex.upsert([
        {
          id,
          values: embedding,
          metadata: { userId }
        }
      ]);

      return updatedNote;
    })


    return Response.json({ updatedNote }, { status: 200 })

  } catch (error) {
    console.error(error)
    return Response.json({error: "Internal server error, from Route PUT NOte"}, { status: 500})
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();

    const parseResult = deleteNoteSchema.safeParse(body);
    
    if(!parseResult.success) {
      console.error(parseResult.error);
      return Response.json({error: "Invalid input"}, {status: 400})
    }
    
    const {id} = parseResult.data;

    const {userId} = auth();

    const note = await prisma.note.findUnique({
      where: { id }
    });

    if(!note) {
      return Response.json({error: "Not Found"}, { status: 404})
    }

    if(!userId || userId !== note.userId) {
      return Response.json({error: "Unauthorized"}, { status: 401})
    }

    await prisma.$transaction(async (tx) => {
      await tx.note.delete({where: {id}});
      await notesIndex.deleteOne(id)
    })


    return Response.json({message: "Note deleted"}, { status: 200})

  } catch (error) {
    console.error(error)
    return Response.json({error: "Internal server error, from Route PUT NOte"}, { status: 500})
  }
}

async function getEmbeddingForNote(title:string, content: string | undefined) {
  return getEmbedding(title + "\n\n" + content ?? "")
}