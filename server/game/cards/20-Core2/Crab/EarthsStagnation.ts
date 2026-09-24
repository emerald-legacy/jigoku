import { CardType } from '../../../Constants.js';
import type { TriggeredAbilityContext } from '../../../TriggeredAbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import type { AbilityContext } from '../../../AbilityContext.js';

function penaltyAmount(context: AbilityContext): number {
    return context.player.hasAffinity('earth', context) ? -2 : -1;
}

export default class EarthsStagnation extends DrawCard {
    static id = 'earth-s-stagnation';

    public setupCardAbilities() {
        this.forcedReaction({
            title: 'Give attached character a skill penalty',
            when: {
                onCardPlayed: (event, context) =>
                    context.source.parentCharacter &&
                    (event.card as DrawCard).type === CardType.Event &&
                    context.source.parentCharacter.isParticipating()
            },
            gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                target: context.source.parentCharacter,
                effect: AbilityDsl.effects.modifyBothSkills(penaltyAmount(context))
            })),
            effect: 'give {1}{2} and {3}{4} to {5}',
            effectArgs: (context) => {
                const penalty = penaltyAmount(context);
                return [penalty, 'military', penalty, 'political', context.source.parentCharacter];
            },
            limit: AbilityDsl.limit.unlimitedPerConflict()
        });
    }

    public canPlay(context: TriggeredAbilityContext, playType: string) {
        return (
            context.player.cardsInPlay.some(
                (card: DrawCard) => card.getType() === CardType.Character && card.hasTrait('shugenja')
            ) && super.canPlay(context, playType)
        );
    }
}
