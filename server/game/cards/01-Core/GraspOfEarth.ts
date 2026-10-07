import { Location, Players, PlayType } from '../../Constants.js';
import * as costs from '../../costs/index.js';
import { cardCannot, playerCannot, reduceCost } from '../../effects.js';
import { cardLastingEffect, playerLastingEffect } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class GraspOfEarth extends DrawCard {
    static id = 'grasp-of-earth';

    public setupCardAbilities() {
        this.attachmentConditions({
            myControl: true,
            trait: 'shugenja'
        });

        this.persistentEffect({
            location: Location.Any,
            targetController: Players.Any,
            condition: (context) => context.player.hasAffinity('earth', context),
            effect: reduceCost({ amount: 1, match: (card, source) => card === source })
        });

        this.action('Opponent\'s cards cannot join this conflict')
            .cost(costs.bowSelf())
            .condition((context) => this.game.isDuringConflict() && context.player.opponent !== undefined)
            .gameAction(cardLastingEffect((context) => ({
                target: context.player.opponent?.cardsInPlay.slice(),
                effect: cardCannot('moveToConflict')
            })), playerLastingEffect((context) => ({
                targetController: context.player.opponent,
                effect: playerCannot({
                    cannot: PlayType.PlayFromHand,
                    restricts: 'characters'
                })
            })))
            .effect('prevent the opponent from bringing characters to the conflict');
    }
}
