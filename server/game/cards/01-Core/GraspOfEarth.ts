import { PlayType, RestrictionType, RestrictionScope } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { cardCannot, playerCannot } from '../../effects.js';
import DrawCard from '../../DrawCard.js';

export default class GraspOfEarth extends DrawCard {
    static id = 'grasp-of-earth';

    public setupCardAbilities() {
        this.attachmentConditions({
            myControl: true,
            trait: 'shugenja'
        });

        this.action('Opponent\'s cards cannot join this conflict')
            .cost(costs.bowSelf())
            .condition((context) => this.game.isDuringConflict() && context.player.opponent !== undefined)
            .cardLastingEffect((context) => ({
                target: context.player.opponent?.cardsInPlay.slice(),
                effect: cardCannot(RestrictionType.MoveToConflict)
            }))
            .playerLastingEffect((context) => ({
                targetController: context.player.opponent,
                effect: playerCannot({
                    cannot: PlayType.PlayFromHand,
                    appliesTo: RestrictionScope.Characters
                })
            }))
            .chatText('prevent the opponent from bringing characters to the conflict');
    }
}
