import DrawCard from '../../DrawCard.js';
import { Players, CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class ClarityOfPurpose extends DrawCard {
    static id = 'clarity-of-purpose';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Character cannot be bowed and doesn\'t bow during political conflicts',
            condition: () => this.game.isDuringConflict(),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                gameAction: [
                    ability.actions.cardLastingEffect({
                        condition: () => this.game.isDuringConflict('political'),
                        effect: ability.effects.doesNotBow()
                    }),
                    ability.actions.cardLastingEffect(context => ({
                        effect: ability.effects.cardCannot({
                            cannot: 'bow',
                            restricts: 'opponentsCardEffects',
                            applyingPlayer: context.player
                        })
                    }))
                ]
            },
            effect: 'prevent opponents\' actions from bowing {0} and stop it bowing at the end of a political conflict'
        });
    }
}


export default ClarityOfPurpose;
