"use client";

import { TextStyleKit } from "@tiptap/extension-text-style";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { Button } from "@/components/ui/button";
import { useFormContext, Controller } from "react-hook-form";
import { CodeXml } from "lucide-react";

const RichTextEditor = ({
  name,
  placeholder = "Course Description...",
}: {
  name: string;
  placeholder?: string;
}) => {
  const { control, setValue } = useFormContext();

  // Call useEditor hook unconditionally with immediate rendering disabled
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      TextStyleKit,
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      setValue(name, editor.getHTML(), { shouldDirty: true });
    },
  });

  // Render logic
  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-gray-300 bg-gray-50 p-2 flex items-center gap-2 flex-wrap">
        <select
          className="p-1 border rounded-tl-lg text-sm bg-white"
          onChange={(e) =>
            editor.chain().focus().setTextAlign(e.target.value).run()
          }
          defaultValue="left"
        >
          <option value="left">Normal</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
          <option value="justify">Justify</option>
        </select>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 font-bold"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().toggleBold()}
        >
          B
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 italic"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().toggleItalic()}
        >
          I
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 underline"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={!editor.can().toggleUnderline()}
        >
          U
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={!editor.can().toggleOrderedList()}
        >
          1.
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={!editor.can().toggleBulletList()}
        >
          •
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          disabled={!editor.can().toggleCodeBlock()}
        >
          <CodeXml className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          disabled={!editor.can().toggleHeading({ level: 1 })}
        >
          H1
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          disabled={!editor.can().toggleHeading({ level: 2 })}
        >
          H2
        </Button>
      </div>

      {/* Editor */}
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={({ field }) => (
          <EditorContent
            editor={editor}
            onBlur={() =>
              setValue(name, editor.getHTML(), { shouldDirty: true })
            }
            className="min-h-[150px] border-0 p-3 outline-none focus:outline-none"
            onFocus={() => editor.commands.setContent(field.value || "")}
          />
        )}
      />
    </div>
  );
};

export default RichTextEditor;
