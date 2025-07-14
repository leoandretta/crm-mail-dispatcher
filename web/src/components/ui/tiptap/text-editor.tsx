import { RichTextEditor, Link } from '@mantine/tiptap';
import { useEditor} from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import { Pill, ScrollArea, Text, Tooltip } from '@mantine/core';

import { getGreetings } from '@/utils/greetings';


import classes from "./text-editor.module.css"
import '@mantine/tiptap/styles.css'
import { useRef } from 'react';

interface TextEditorProps {
    onChange: any;
    value?: any;
    defaultValue?: any;
    checked?: any;
    defaultChecked?: any;
    error?: any;
    onFocus?: any;
    onBlur?: any;
}


const TextEditor = ({ value, onChange, onBlur, onFocus }: TextEditorProps) => {
    const countRenderRef = useRef(0);
    countRenderRef.current += 1;
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link,
            Highlight,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Image
        ],
        content: value,
        immediatelyRender: true,
        shouldRerenderOnTransaction: false,
        onUpdate({ editor }) {
            const html = editor.getHTML()
            onChange(html);
        },
        onBlur({ editor }) {
            const html = editor.getHTML()
            onBlur(html);
        },
        onFocus({ editor }) {
            const html = editor.getHTML()
            onFocus(html);
        },
    })

    const onContentClick = () => {
        if(!editor) return;
        editor.commands.focus()
    }

    const Greeetings = () => {
        return (
            <Tooltip label="Preenchida automáticamente" position="bottom-end" >
                <Text px={16} pt={16} className={classes.greetings} onClick={(e) => e.preventDefault()} onClickCapture={(e) => e.preventDefault()} >
                    {getGreetings()}&nbsp;
                    <Pill size="lg">[CONTATO]</Pill>,
                    {countRenderRef.current}
                </Text>
            </Tooltip>
        )
    }

    const Signature = () => {
        return (
            <Tooltip label="Preenchida automáticamente" position="bottom-end" >
                <Text px={16} className={classes.signature}>
                    Atenciosamente,<br />
                    <img src={`/public/images/signature.png`} width="400px" height="200px" />
                </Text>
            </Tooltip>
        )
    }
    
    return (
        <RichTextEditor editor={editor}  >
            <RichTextEditor.Toolbar>
                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Undo />
                    <RichTextEditor.Redo />
                </RichTextEditor.ControlsGroup>
                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Bold />
                    <RichTextEditor.Italic />
                    <RichTextEditor.Underline />
                    <RichTextEditor.Strikethrough />
                    <RichTextEditor.ClearFormatting />
                    <RichTextEditor.Highlight />
                    <RichTextEditor.Code />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.H1 />
                    <RichTextEditor.H2 />
                    <RichTextEditor.H3 />
                    <RichTextEditor.H4 />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Blockquote />
                    <RichTextEditor.Hr />
                    <RichTextEditor.BulletList />
                    <RichTextEditor.OrderedList />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.Link />
                    <RichTextEditor.Unlink />
                </RichTextEditor.ControlsGroup>

                <RichTextEditor.ControlsGroup>
                    <RichTextEditor.AlignLeft />
                    <RichTextEditor.AlignCenter />
                    <RichTextEditor.AlignJustify />
                    <RichTextEditor.AlignRight />
                </RichTextEditor.ControlsGroup>

                    
            </RichTextEditor.Toolbar>

            <ScrollArea.Autosize h="500px" offsetScrollbars scrollbars="y" className={classes.rich_text_area} onClickCapture={onContentClick} >
                <Greeetings />
                <RichTextEditor.Content />
                <Signature />
            </ScrollArea.Autosize>
        </RichTextEditor>
    );
};

export default TextEditor;