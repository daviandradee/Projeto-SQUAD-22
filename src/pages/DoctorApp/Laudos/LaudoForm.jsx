// PatientList.jsx
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Bar from '../../../components/Bar';
import Image from '@tiptap/extension-image';

function LaudoForm() {
    const editor = useEditor({
        extensions: [StarterKit, Image],
        content: ""
    })
    const comandos = {
        toggleBold: () => editor.chain().focus().toggleBold().run(),
        toggleItalic: () => editor.chain().focus().toggleItalic().run(),
        toggleUnderline: () => editor.chain().focus().toggleUnderline().run(),
        toggleCodeBlock: () => editor.chain().focus().toggleCodeBlock().run(),
        toggleH1: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
        toggleH2: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        toggleH3: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
        toggleParrafo: () => editor.chain().focus().setParagraph().run(),
        toggleListaOrdenada: () => editor.chain().focus().toggleOrderedList().run(),
        toggleListaPuntos: () => editor.chain().focus().toggleBulletList().run(),
        agregarImagen: () => {
            const url = window.prompt('URL da imagem')
            editor.chain().focus().setImage({ src: url }).run();

        },
        agregarLink: () => {
            const url = window.prompt('URL do link')
            if (url) {
                editor.chain().focus().setLink({ href: url }).run()
            }
        }
    }

    return (
        <div className="content">
            <h4 className="page-title">Laudo Médico</h4>
            <Bar comandos={comandos} />
            <EditorContent editor={editor} />
        </div>
    );
}

export default LaudoForm;
;