import { msg } from '../GameChat.js';
import type { AbilityContext } from '../AbilityContext.js';
import { CardType, Element } from '../Constants.js';
import { BaseAbility } from '../BaseAbility.js';
import type DrawCard from '../DrawCard.js';
import { removeFate } from '../GameActions/GameActions.js';

export class VoidRingAbility extends BaseAbility {
    public override title = 'Void Ring Effect';
    public override cannotTargetFirst = true;
    public defaultPriority = 2; // Default resolution priority when players have ordering switched off

    constructor(
        optional: boolean,
        private onResolution = (_resolved: boolean) => {}
    ) {
        super({
            target: {
                activePromptTitle: 'Choose character to remove fate from',
                source: 'Void Ring',
                buttons: optional ? [{ text: 'Don\'t resolve', arg: 'dontResolve' }] : [],
                cardType: CardType.Character,

                cardCondition: <Card extends DrawCard>(card: Card, context: AbilityContext) =>
                    card.allowGameAction('removeFate', context)
            }
        });
    }

    public override executeHandler(context: AbilityContext): void {
        if(context.target) {
            context.game.addMessage(msg`${context.player} resolves the ${Element.Void} ring, removing a fate from ${context.target}`);
            this.onResolution(true);
            context.game.addAnimation({ type: Element.Void, targetUuid: context.target.uuid, effect: 'remove-fate' });
            context.game.resolveActions([removeFate({ target: context.target })], context);
        } else {
            context.game.addMessage(msg`${context.player} chooses not to resolve the ${Element.Void} ring`);
            this.onResolution(false);
        }
    }
}
