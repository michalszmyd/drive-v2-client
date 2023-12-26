import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],

  [{ 'header': 1 }, { 'header': 2 }],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  [{ 'script': 'sub'}, { 'script': 'super' }],
  [{ 'indent': '-1'}, { 'indent': '+1' }],
  [{ 'direction': 'rtl' }],

  [{ 'size': ['small', false, 'large', 'huge'] }],
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  [{ 'color': [] }, { 'background': [] }],
  [{ 'font': [] }],
  [{ 'align': [] }],

  ['clean']
];

const formats = [
  'background',
  'bold',
  'color',
  'font',
  'code',
  'italic',
  'link',
  'size',
  'strike',
  'script',
  'underline',
  'blockquote',
  'header',
  'indent',
  'list',
  'align',
  'direction',
  'code-block',
]
export type RichEditorChangeEvent ={
  target: {name: string; value: string}
}

export default function RichTextEditor({
  value,
  name,
  onChange
}: {
  value: string;
  name: string;
  onChange: ({target: {name, value}}: RichEditorChangeEvent) => void;
}) {
  const onTextChange = (changedValue: string) => {
    onChange({
      target: {
        name,
        value: changedValue
      }
    })
  }

  return (
    <ReactQuill
      theme="snow"
      modules={{toolbar: toolbarOptions}}
      value={value}
      onChange={onTextChange}
      placeholder={name}
      formats={formats}
    />
  )
}
