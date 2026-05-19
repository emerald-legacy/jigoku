import AbilityDsl from '../../../abilitydsl.js';
import { CardTypes } from '../../../Constants.js';
import DrawCard from '../../../drawcard.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';

export default class CloudTheMind2 extends DrawCard {
    static id = 'cloud-the-mind-2';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.blank()
        });

        this.whileAttached({
            condition: (context) => context.source.controller.hasAffinity('air', context),
            effect: AbilityDsl.effects.cardCannot('triggerAbilities')
        });
    }

    public canPlay(context: TriggeredAbilityContext, playType: string) {
        return (
            context.player.cardsInPlay.some(
                (card: DrawCard) => card.getType() === CardTypes.Character && card.hasTrait('shugenja')
            ) && super.canPlay(context, playType)
        );
    }
}
