type Player = {
    user: {
        username: string;
        emailHash?: string;
        settings?: { disableGravatar?: boolean };
    };
};

type MessageText = string | Array<string | number>;

type MsgArg =
    | string
    | number
    | { name: string }
    | { getShortSummary: () => string }
    | { message: MessageText }
    | Array<MsgArg>;

export class GameChat {
    messages: Array<{
        date: Date;
        message: any;
    }> = [];

    addChatMessage(player: Player, message: MsgArg): void {
        const playerArg = {
            name: player.user.username,
            emailHash: player.user.emailHash,
            noAvatar: player.user.settings?.disableGravatar
        };

        this.addMessage('{0} {1}', playerArg, message);
    }

    addMessage(message: string, ...args: Array<MsgArg>): void {
        const formattedMessage = this.formatMessage(message, args);
        this.messages.push({ date: new Date(), message: formattedMessage });
    }

    addAlert(type: string, message: string, ...args: Array<MsgArg>): void {
        const formattedMessage = this.formatMessage(message, args);
        this.messages.push({ date: new Date(), message: { alert: { type: type, message: formattedMessage } } });
    }

    formatMessage(format: string, args: Array<MsgArg>): MessageText {
        if(!format) {
            return '';
        }

        let fragments = format.split(/(\{\d+\})/);
        return fragments.reduce<Array<string | number>>((output, fragment) => {
            let argMatch = fragment.match(/\{(\d+)\}/);
            if(argMatch && args) {
                let arg: MsgArg = args[Number(argMatch[1])];
                if(arg || arg === 0) {
                    if((arg as { message?: MessageText }).message) {
                        return output.concat((arg as { message: MessageText }).message);
                    } else if(Array.isArray(arg)) {
                        if(typeof arg[0] === 'string' && arg[0].includes('{')) {
                            return output.concat(this.formatMessage(arg[0], arg.slice(1)));
                        }
                        return output.concat(this.formatArray(arg));
                    } else if((arg as { getShortSummary?: () => string }).getShortSummary) {
                        return output.concat((arg as { getShortSummary: () => string }).getShortSummary());
                    }
                    return output.concat(arg as string | number);
                }
            } else if(!argMatch && fragment) {
                let splitFragment = fragment.split(' ');
                let lastWord = splitFragment.pop();
                return splitFragment
                    .reduce<Array<string | number>>((output, word) => {
                        return output.concat(word || [], ' ');
                    }, output)
                    .concat(lastWord || []);
            }
            return output;
        }, []);
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
