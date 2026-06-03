import DrawCard from '../../DrawCard.js';
import { Duration, Players, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class CenteredBreath extends DrawCard {
    static id = 'centered-breath';

    setupCardAbilities() {
        this.action({
            title: 'Add an additional ability use to a monk',
            target: {
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: card => card.hasTrait('monk') && card.isParticipating(),
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.cardLastingEffect({
                        duration: Duration.UntilEndOfRound,
                        effect: AbilityDsl.effects.increaseLimitOnPrintedAbilities()
                    }),
                    AbilityDsl.actions.playerLastingEffect(context => ({
                        targetController: context.player,
                        duration: Duration.UntilPassPriority,
                        effect: context.player.isKihoPlayedThisConflict(context, this) ? AbilityDsl.effects.additionalAction() : []
                    }))
                ])
            },
            effect: 'add an additional use to each of {0}\'s printed abilities{1}',
            effectArgs: context => [context.player.isKihoPlayedThisConflict(context, this) ? ' and take an additional action' : '']
        });
    }
}


export default CenteredBreath;
