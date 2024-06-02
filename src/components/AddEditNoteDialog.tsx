import { CreateNoteSchema, createNoteSchema } from "@/lib/validation/note"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import LoadingButton from "./ui/loading-button"
import { useRouter } from "next/navigation"
import { Note } from "@prisma/client"
import { useState, useEffect } from "react"
import { useOrganization } from "@clerk/nextjs"
import { auth } from "@clerk/nextjs/server"

interface AddEditNoteDialogProps {
  open: boolean,
  setOpen: (open: boolean) => void,
  noteToEdit?: Note
}

const AddEditNoteDialog = ({open, setOpen, noteToEdit}: AddEditNoteDialogProps) => {
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const router = useRouter();
  
  const { organization } = useOrganization();
  console.log("organization", organization?.membersCount)

  const form = useForm<CreateNoteSchema>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      title: noteToEdit?.title || "",
      content: noteToEdit?.content || "",
      organizationId: organization?.id || "",
    }
  });

  useEffect(() => {
    form.setValue('organizationId', organization?.id || "");
  }, [organization?.id, form]);

  async function onSubmit(input: CreateNoteSchema) {
    try {
      if (noteToEdit) {
        const response = await fetch("/api/notes", {
          method: "PUT",
          body: JSON.stringify({
            id: noteToEdit.id,
            ...input
          })
        });

        if (!response.ok) {
          throw Error("Status Code: " + response.status);
        }
      } else {
        const response = await fetch("/api/notes", {
          method: "POST",
          body: JSON.stringify(input)
        });

        if (!response.ok) {
          throw Error("Status Code: " + response.status);
        }

        form.reset();
      }

      router.refresh();
      setOpen(false);

    } catch (error) {
      console.error(error);
      alert("Something went wrong, please try again!");
    }
  }

  async function deleteNote() {
    if (!noteToEdit) return;
    setDeleteInProgress(true);
    try {
      const response = await fetch("api/notes", {
        method: "DELETE",
        body: JSON.stringify({
          id: noteToEdit.id
        })
      });

      if (!response.ok) {
        throw Error("Status Code: " + response.status);
      }

      router.refresh();
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("Something went wrong, please try again!");
    } finally {
      setDeleteInProgress(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {noteToEdit ? "Edit Note" : "Add Note"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Note Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note Content</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Note Content" {...field} />
                  </FormControl>
                  <FormDescription>
                    Add Note Dialog
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="organizationId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input type="hidden" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <DialogFooter className="gap-2 sm:gap-0">
              {noteToEdit && (
                <LoadingButton
                  variant="destructive"
                  loading={deleteInProgress}
                  disabled={form.formState.isSubmitting}
                  onClick={deleteNote}
                  type="button"
                >
                  Delete Note
                </LoadingButton>
              )}
              <LoadingButton 
                type="submit" 
                loading={form.formState.isSubmitting}
                disabled={deleteInProgress}
              >
                Submit
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddEditNoteDialog;
