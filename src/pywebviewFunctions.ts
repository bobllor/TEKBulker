import { ReaderType } from "./components/SettingsComponents/types";
import "./pywebview";

/**
 * Retrieves the contents of the reader.
 * @param reader The Reader type
 * @returns The Reader content, which is an Object with a string of any type
 */
export async function getReaderContent(reader: ReaderType): Promise<Record<string, any>>{
    const res: Record<string, string> = await window.pywebview.api.get_reader_content(reader);

    return res;
}