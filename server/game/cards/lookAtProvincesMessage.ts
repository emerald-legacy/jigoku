import type { AbilityContext } from '../AbilityContext.js';
import type BaseCard from '../BaseCard.js';
import { msg, type MessageArgs, type MsgArg } from '../GameChat.js';

/**
 * The chat line for looking at provinces. A province is named ('<source> sees X in province 1'), except the player's
 * own facedown province: only its location ('<source> looks at player1's province 1'), so the opponent
 * doesn't learn it.
 */
export function lookAtProvincesMessage(context: AbilityContext, provinces: BaseCard[]): MessageArgs {
    const chat = context.game.gameChat;
    const isOwnFacedown = (province: BaseCard) => province.controller === context.player && province.isFacedown();
    const seen = provinces
        .filter((province) => !isOwnFacedown(province))
        .map((province) => chat.nested(msg`${province} in ${province.location}`));
    const own = provinces
        .filter(isOwnFacedown)
        .map((province) => chat.nested(msg`${province.controller}'s ${province.location}`));
    if(own.length === 0) {
        return msg`${context.source} sees ${listOf(context, seen)}`;
    }
    if(seen.length === 0) {
        return msg`${context.source} looks at ${listOf(context, own)}`;
    }
    return msg`${context.source} sees ${listOf(context, seen)}, and looks at ${listOf(context, own)}`;
}

function listOf(context: AbilityContext, items: MsgArg[]): MsgArg {
    const indexes = items.map((_item, index) => `{${index}}`);
    const format = indexes.length < 3
        ? indexes.join(' and ')
        : `${indexes.slice(0, -1).join(', ')}, and ${indexes[indexes.length - 1]}`;
    return context.game.gameChat.nested([format, items]);
}
