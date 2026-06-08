import type { AbilityContext } from '../../AbilityContext.js';
import { CardType } from '../../Constants.js';
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
                !!(context.source.type === CardType.Attachment &&
                context.source.parent &&
                context.source.parent.isParticipating()),
            printedAbility: false,
            target: {
                cardType: CardType.Character,
                cardCondition: (card, context) => card.isParticipating() && card !== context.source.parent,
                gameAction: AbilityDsl.actions.removeFate((context: AbilityContext<this>) => ({
                    recipient: context.source.parent as DrawCard
                }))
            },
            effect: 'steal a fate from {0} and place it on {1}',
            effectArgs: (context) => context.source.parent ?? ''
        });
    }

    leavesPlay() {
        this.printedType = CardType.Character;
        super.leavesPlay();
    }
}
