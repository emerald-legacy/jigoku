import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class TheStrengthOfTheMountain extends DrawCard {
    static id = 'the-strength-of-the-mountain';

    setupCardAbilities() {
        this.action({
            title: 'Defending characters do not bow',
            condition: () => this.game.isDuringConflict(),
            gameAction: [
                AbilityDsl.actions.cardLastingEffect(context => ({
                    target: context.game.currentConflict.getDefenders(),
                    effect: AbilityDsl.effects.doesNotBow()
                })),
                AbilityDsl.actions.cardLastingEffect(context => ({
                    target: context.game.currentConflict.getDefenders(),
                    effect: [
                        AbilityDsl.effects.cardCannot({
                            cannot: 'sendHome',
                            restricts: 'opponentsCardEffects',
                            applyingPlayer: context.player
                        }),
                        AbilityDsl.effects.cardCannot({
                            cannot: 'bow',
                            restricts: 'opponentsCardEffects',
                            applyingPlayer: context.player
                        })
                    ]
                }))
            ],
            effect: 'prevent opponents\' actions from bowing or moving home defending characters, and stop them bowing at the end of a the conflict'
        });
    }
}


export default TheStrengthOfTheMountain;
