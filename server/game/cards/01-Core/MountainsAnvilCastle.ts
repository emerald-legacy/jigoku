import { CardType } from '../../Constants.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import AbilityDsl from '../../abilitydsl.js';
import type DrawCard from '../../DrawCard.js';

export default class MountainsAnvilCastle extends StrongholdCard {
    static id = 'mountain-s-anvil-castle';

    setupCardAbilities() {
        this.action<DrawCard>({
            title: 'Give a character with attachments bonus skill',
            cost: AbilityDsl.costs.bowSelf(),
            condition: () => Boolean(this.game.currentConflict),
            target: {
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating() && card.attachments.length > 0,
                gameAction: AbilityDsl.actions.cardLastingEffect<DrawCard>((context) => ({
                    effect: AbilityDsl.effects.modifyBothSkills(Math.min(context.target?.attachments.length ?? 0, 2))
                }))
            },
            effect: 'give {0} +{1}{2}/{1}{3}',
            effectArgs: (context) => [Math.min(context.target?.attachments.length ?? 0, 2), 'military', 'political']
        });
    }
}
