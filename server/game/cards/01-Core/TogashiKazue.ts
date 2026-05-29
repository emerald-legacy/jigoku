import type { AbilityContext } from '../../AbilityContext.js';
import { CardTypes } from '../../Constants.js';
import { PlayCharacterAsAttachment } from '../../PlayCharacterAsAttachment.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

export default class TogashiKazue extends DrawCard {
    static id = 'togashi-kazue';

    setupCardAbilities() {
        this.abilities.playActions.push(new PlayCharacterAsAttachment(this));
        this.action({
            title: 'Steal a fate',
            condition: (context) =>
                !!(context.source.type === CardTypes.Attachment &&
                context.source.parent &&
                context.source.parent.isParticipating()),
            printedAbility: false,
            target: {
                cardType: CardTypes.Character,
                cardCondition: (card, context) => card.isParticipating() && card !== context.source.parent,
                gameAction: AbilityDsl.actions.removeFate((context: AbilityContext) => ({
                    recipient: context.source.parent
                }))
            },
            effect: 'steal a fate from {0} and place it on {1}',
            effectArgs: (context) => context.source.parent ?? ''
        });
    }

    leavesPlay() {
        this.printedType = CardTypes.Character;
        super.leavesPlay();
    }
}
