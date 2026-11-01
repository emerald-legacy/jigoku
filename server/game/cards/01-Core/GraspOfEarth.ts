import { CardType, Players, PlayType, RestrictionType, RestrictionScope, Trait } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { cardCannot, playerCannot } from '../../effects.js';
import DrawCard from '../../DrawCard.js';

export default class GraspOfEarth extends DrawCard {
    static id = 'grasp-of-earth';

    public override setupCardAbilities() {
        this.attachmentConditions({
            myControl: true,
            trait: Trait.Shugenja
        });

        this.action('Opponent\'s cards cannot join this conflict')
            .condition((context) => this.game.isDuringConflict() && context.player.opponent !== undefined)
            .cost(costs.bowSelf())
            // also characters that enter play or change control later
            .conflictLastingEffect({
                targetController: Players.Opponent,
                match: (card) => card.type === CardType.Character,
                effect: cardCannot(RestrictionType.MoveToConflict)
            })
            .playerLastingEffect((context) => ({
                target: context.player.opponent,
                effect: playerCannot({
                    cannot: PlayType.PlayFromHand,
                    appliesTo: RestrictionScope.Characters
                })
            }))
            .chatText('prevent the opponent from bringing characters to the conflict');
    }
}
