import type { AbilityContext } from '../AbilityContext.js';
import { CardType } from '../Constants.js';
import { PlayAttachmentAction } from '../PlayAttachmentAction.js';

/** The context plays an attachment (or a card as one) that still costs fate: a cost reduction would apply. */
export function isReducibleAttachmentPlay(context: AbilityContext | undefined): context is AbilityContext {
    return context !== undefined &&
        (context.source.type === CardType.Attachment || context.ability instanceof PlayAttachmentAction) &&
        context.ability.getReducedCost(context) > 0;
}
