import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import { Location, Players, CardType, Phases } from '../../../Constants.js';

class Stinger extends DrawCard {
    static id = 'stinger';

    setupCardAbilities() {
        this.whileAttached({
            condition: context => context.game.currentPhase !== Phases.Fate,
            effect: AbilityDsl.effects.cardCannot({
                cannot: 'ready',
                source: this
            })
        });

        this.action({
            title: 'Attach this to an attacking character',
            cost: AbilityDsl.costs.payHonor(1),
            condition: context => context.game.isDuringConflict('military'),
            location: Location.Hand,
            target: {
                player: Players.Self,
                cardType: CardType.Character,
                cardCondition: card => card.isAttacking(),
                gameAction: AbilityDsl.actions.attach(context => ({
                    attachment: context.source,
                    target: context.target
                }))
            }
        });
    }
}

export default Stinger;
