import type Game from '../../Game.js';
import type { MsgArg } from '../../GameChat.js';

declare const introBrand: unique symbol;
declare const freeformBrand: unique symbol;
declare const noneBrand: unique symbol;

interface MessageData {
    kind: 'intro' | 'freeform' | 'none';
    format: string;
    args: MsgArg[];
}

export type WithIntroMessage = MessageData & { readonly [introBrand]: true };
export type FreeformMessage = MessageData & { readonly [freeformBrand]: true };
export type NoMessage = MessageData & { readonly [noneBrand]: true };
export type MessageSpec = WithIntroMessage | FreeformMessage | NoMessage;

export type MessageResult =
    | MessageSpec
    | readonly [WithIntroMessage | NoMessage, ...(FreeformMessage | NoMessage)[]]
    | readonly (FreeformMessage | NoMessage)[];

/** A value that a message template can show. */
export type MessageValue = MsgArg | boolean | readonly MessageValue[];

function toFormat(
    strings: TemplateStringsArray,
    values: readonly MessageValue[]
): Pick<MessageData, 'format' | 'args'> {
    let format = strings[0];
    for(let index = 0; index < values.length; index++) {
        format += `{${index}}` + strings[index + 1];
    }

    return { format, args: values.map(toArg) };
}

function toArg(value: MessageValue): MsgArg {
    if(typeof value === 'boolean') {
        return String(value);
    }
    return Array.isArray(value) ? value.map(toArg) : (value as MsgArg);
}

export const messageKit = {
    /** "{player} plays/uses {source}, paying ..., to <text>". After a duel: "Duel Effect: <text>". */
    withIntro: (strings: TemplateStringsArray, ...values: MessageValue[]) =>
        ({ kind: 'intro', ...toFormat(strings, values) }) as WithIntroMessage,
    /** The text exactly as written. */
    freeform: (strings: TemplateStringsArray, ...values: MessageValue[]) =>
        ({ kind: 'freeform', ...toFormat(strings, values) }) as FreeformMessage,
    /** No message. */
    none: () => ({ kind: 'none', format: '', args: [] }) as unknown as NoMessage
};

export type MessageKit = typeof messageKit;

/** The messages to print, without the "none" entries. */
export function messageList(result: MessageResult): MessageData[] {
    const list: readonly MessageData[] = Array.isArray(result) ? result : [result as MessageData];
    return list.filter((message) => message.kind !== 'none');
}

/** One message as a chat argument. */
export function formatted(game: Game, message: MessageData): MsgArg {
    return { message: game.gameChat.formatMessage(message.format, message.args) };
}
