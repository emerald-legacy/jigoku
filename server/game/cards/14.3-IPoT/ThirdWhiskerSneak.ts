import DrawCard from '../../DrawCard.js';
import { Location } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class ThirdWhiskerSneak extends DrawCard {
    static id = 'third-whisker-sneak';

    setupCardAbilities() {
        this.persistentEffect({
            effect: [
                AbilityDsl.effects.immunity({
                    restricts: 'maho'
                }),
                AbilityDsl.effects.immunity({
                    restricts: 'shadowlands'
                })]
        });

        this.reaction('Add a card to your hand')
            .when({
                afterConflict: (event, context) => event.conflict.winner === context.source.controller && event.conflict.conflictUnopposed && context.source.isParticipating()
            })
            .gameAction(AbilityDsl.actions.deckSearch({
                amount: (context) => context.player.getProvinces(a => !a.isBroken).length,
                reveal: false,
                gameAction: AbilityDsl.actions.moveCard({
                    destination: Location.Hand
                })
            }))
            .effect('look at the top {1} cards of their conflict deck', context => [context.player.getProvinces(a => !a.isBroken).length]);
    }
}


export default ThirdWhiskerSneak;
