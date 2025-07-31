"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import type ReactQuill from "react-quill-new";

import "react-quill-new/dist/quill.snow.css";

interface EditorProps {
	onChange: (value: string) => void;
	value: string;
}

type QuillProps = ReactQuill["props"] & {
	forwardedRef?: React.Ref<ReactQuill>;
};

export const Editor = ({ onChange, value }: EditorProps) => {
	const ReactQuill = useMemo(
		() =>
			dynamic(
				async () => {
					const { default: RQ } = await import("react-quill-new");
					return function comp({
						forwardedRef,
						...props
					}: QuillProps) {
						return <RQ ref={forwardedRef} {...props} />;
					};
				},
				{
					ssr: false,
					loading: () => (
						<div className="h-40 w-full bg-slate-200 animate-pulse" />
					),
				}
			),
		[]
	);

	const modules = {
		toolbar: [
			[{ header: [1, 2, false] }],
			["bold", "italic", "underline", "strike", "blockquote"],
			[{ list: "ordered" }, { list: "bullet" }],
			["link", "clean"],
		],
	};

	const formats = [
		"header",
		"bold",
		"italic",
		"underline",
		"strike",
		"blockquote",
		"list",
		"bullet",
		"link",
	];

	return (
		<div className="bg-white">
			<ReactQuill
				theme="snow"
				value={value}
				onChange={onChange}
				modules={modules}
				formats={formats}
			/>
		</div>
	);
};