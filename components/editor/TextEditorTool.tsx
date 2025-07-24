"use client";

import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useFormContext, Controller } from "react-hook-form";

interface RichTextEditorProps {
  name: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ name }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const { control, watch, setValue } = useFormContext();
  const content = watch(name);

  // Keep editor in sync with form value
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content || "";
    }
  }, [content]);

  const exec = (command: string, value?: string) => {
    const el = editorRef.current;
    if (!el) return;
    el.focus();

    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;

    switch (command) {
      case "insertOrderedList":
        document.execCommand("insertOrderedList");
        break;
      case "insertUnorderedList":
        document.execCommand("insertUnorderedList");
        break;
      case "formatBlock":
        // Must use uppercase tags in older browsers
        document.execCommand("formatBlock", false, value?.toUpperCase());
        break;
      default:
        document.execCommand(command);
    }

    setValue(name, el.innerHTML);
  };

  return (
    <div>
      {/* Toolbar */}
      <div className="border border-gray-300 rounded-t-lg bg-gray-50 p-2 flex items-center gap-2 flex-wrap">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 font-bold"
          onClick={() => exec("bold")}
          type="button"
        >
          B
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 italic"
          onClick={() => exec("italic")}
          type="button"
        >
          I
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 underline"
          onClick={() => exec("underline")}
          type="button"
        >
          U
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => exec("insertOrderedList")}
          type="button"
        >
          1.
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => exec("insertUnorderedList")}
          type="button"
        >
          •
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => exec("formatBlock", "<h1>")}
          type="button"
        >
          H1
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() => exec("formatBlock", "<h2>")}
          type="button"
        >
          H2
        </Button>
      </div>

      {/* Editor */}
      <Controller
        name={name}
        control={control}
        defaultValue=""
        render={() => (
          <div
            ref={editorRef}
            contentEditable
            className="min-h-[150px] border border-t-0 border-gray-300 p-3 focus:outline-none"
            onInput={() => {
              if (editorRef.current) {
                setValue(name, editorRef.current.innerHTML, {
                  shouldDirty: true,
                });
              }
            }}
            suppressContentEditableWarning={true}
          />
        )}
      />
    </div>
  );
};

export default RichTextEditor;
