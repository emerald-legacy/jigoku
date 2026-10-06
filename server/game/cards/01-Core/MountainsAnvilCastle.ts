import { CardType } from '../../Constants.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { modifyBothSkills } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

export default class MountainsAnvilCastle extends StrongholdCard {
    static id = 'mountain-s-anvil-castle';

    setupCardAbilities() {
        this.action('Give a character with attachments bonus skill')
            .cost(AbilityDsl.costs.bowSelf())
            .condition(() => Boolean(this.game.currentConflict))
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating() && card.attachments.length > 0
            }, cardLastingEffect((context) => ({
                effect: modifyBothSkills(Math.min(context.target?.attachments.length ?? 0, 2))
            })))
            .effect('give {0} +{1}{2}/{1}{3}', (context) => [Math.min(context.target.attachments.length, 2), 'military', 'political']);
    }
}
