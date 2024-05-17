import Note from '@/components/Note';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react'
import prisma from '@/lib/db/prisma';

const NotesPage = async () => {
  const { userId } = auth();

  if(!userId) redirect("/sign-in")
  

  const allNotes = await prisma.note.findMany({
    where: {userId}
  });

  return (
    <div className=' grid gap-3 sm:grid-cols-2 lg:grid-cols-3'>
      {allNotes.map((note) => (
        <Note note={note} key={note.id} />
      ))}
      {allNotes.length === 0 && (
        <div className=' col-span-full text-center'>
          {"You don't have any notes yet. Please create one!"}
        </div>
      )}
    </div>
  )
}

export default NotesPage
