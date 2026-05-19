import DrawCard from '../../drawcard.js';
import { TargetModes, CardTypes, Locations, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class HeavyBallista extends DrawCard {
    static id = 'heavy-ballista';

    setupCardAbilities() {
        this.action({
            title: 'Bow or remove 1 fate',
            condition: context => this.game.isDuringConflict('military') && context.player.isDefendingPlayer(),
            cost: AbilityDsl.costs.discardCard({ location: Locations.Hand }),
            targets: {
                character: {
                    cardType: CardTypes.Character,
                    cardCondition: card => card.isAttacking() && !card.bowed
                },
                select: {
                    mode: TargetModes.Select,
                    dependsOn: 'character',
                    player: context => context.targets.character.controller === context.player ? Players.Self : Players.Opponent,
                    choices: {
                        'Bow': AbilityDsl.actions.bow(context => ({ target: context.targets.character })),
                        'Remove 1 Fate': AbilityDsl.actions.removeFate(context => ({ target: context.targets.character }))
                    }
                }
            }
        });
    }
}


export default HeavyBallista;
