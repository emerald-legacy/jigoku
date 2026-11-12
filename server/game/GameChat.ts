type Player = {
    user: {
        username: string;
        emailHash?: string;
        settings?: { disableGravatar?: boolean };
    };
};

/** Game objects appear in a message as their short summary, which the client renders. */
type MessageFragment = string | number | { name: string };

type MessageText = string | Array<MessageFragment>;

export type MsgArg =
    | string
    | number
    | undefined
    | null
    | { name: string }
    | { getShortSummary: () => { name: string } }
    | { message: MessageText }
    | Array<MsgArg>;

export type MessageArgs = [string, MsgArg[]];

/** Text kept as one fragment, so the client shows no icons in it (player chat, quoted ability titles). */
export function verbatim(text: string | undefined): { message: MessageText } {
    return { message: text ?? '' };
}

/** A message written as a template: `msg\`take 1 ${resource} from ${player}\``. */
export function msg(strings: TemplateStringsArray, ...args: MsgArg[]): MessageArgs {
    const format = strings.slice(1).reduce((text, part, index) => `${text}{${index}}${part}`, strings[0]);
    return [format, args];
}

type StoredMessage = MessageText | { alert: { type: string; message: MessageText } };

export class GameChat {
    messages: Array<{
        date: Date;
        message: StoredMessage;
    }> = [];

    addChatMessage(player: Player, message: MsgArg): void {
        const playerArg = {
            name: player.user.username,
            emailHash: player.user.emailHash,
            noAvatar: player.user.settings?.disableGravatar
        };

        this.addMessage(msg`${playerArg} ${typeof message === 'string' ? verbatim(message) : message}`);
    }

    addMessage([format, args]: MessageArgs): void {
        this.messages.push({ date: new Date(), message: this.formatMessage(format, args) });
    }

    addAlert(type: string, [format, args]: MessageArgs): void {
        this.messages.push({ date: new Date(), message: { alert: { type: type, message: this.formatMessage(format, args) } } });
    }

    formatMessage(format: string, args: Array<MsgArg>): MessageText {
        if(!format) {
            return '';
        }

        const fragments = format.split(/(\{\d+\})/);
        return fragments.reduce<Array<MessageFragment>>((output, fragment) => {
            const argMatch = fragment.match(/\{(\d+)\}/);
            if(argMatch && args) {
                const arg: MsgArg = args[Number(argMatch[1])];
                if(arg || arg === 0) {
                    if(typeof arg === 'object' && 'message' in arg) {
                        return output.concat(arg.message);
                    } else if(Array.isArray(arg)) {
                        return output.concat(this.formatArray(arg));
                    } else if(typeof arg === 'object' && 'getShortSummary' in arg) {
                        return output.concat(arg.getShortSummary());
                    }
                    if(typeof arg === 'string') {
                        return output.concat(this.splitWords(arg));
                    }
                    return output.concat(arg);
                }
            } else if(!argMatch && fragment) {
                return output.concat(this.splitWords(fragment));
            }
            return output;
        }, []);
    }

    /** Splits text into words and spaces, so the client can match each word as an icon keyword. */
    private splitWords(text: string): Array<string> {
        const words = text.split(' ');
        const lastWord = words.pop();
        return words
            .reduce<Array<string>>((output, word) => output.concat(this.splitPunctuation(word), ' '), [])
            .concat(this.splitPunctuation(lastWord));
    }

    /** Splits trailing punctuation off a word, so the client can still match it as an icon keyword (`card,` → `card`, `,`). */
    private splitPunctuation(word: string | undefined): Array<string> {
        const match = word?.match(/^(.*?\w)([,.;:!?]+)$/);
        if(match) {
            return [match[1], match[2]];
        }
        return word ? [word] : [];
    }

    /** A message built elsewhere as `[format, args]`, to be passed as one argument of another message. */
    nested([format, args]: MessageArgs): { message: MessageText } {
        return { message: this.formatMessage(format, args) };
    }

    formatArray(array: Array<MsgArg>): MessageText {
        if(array.length === 0) {
            return [];
        }

        const format =
            array.length === 1
                ? '{0}'
                : array.length === 2
                    ? '{0} and {1}'
                    : Array.from({ length: array.length - 1 })
                        .map((_, idx) => `{${idx}}`)
                        .join(', ') + ` and {${array.length - 1}}`;

        return this.formatMessage(format, array);
    }
}
