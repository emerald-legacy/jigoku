import DrawCard from '../../DrawCard.js';
import { Location } from '../../Constants.js';
import { immunity } from '../../effects.js';
import { moveCard } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';

class ThirdWhiskerSneak extends DrawCard {
    static id = 'third-whisker-sneak';

    setupCardAbilities() {
        this.persistentEffect({
            effect: [
                immunity({
                    appliesTo: { trait: 'maho' }
                }),
                immunity({
                    appliesTo: { trait: 'shadowlands' }
                })]
        });

        this.reaction('Add a card to your hand')
            .when({
                afterConflict: (event, context) => event.conflict.winner === context.source.controller && event.conflict.conflictUnopposed && context.source.isParticipating()
            })
            .deckSearch({
                cardsToLookAt: (context) => context.player.getProvinces((a) => !a.isBroken).length,
                reveal: false,
                gameAction: moveCard({
                    destination: Location.Hand
                })
            })
            .chatText((context) => msg`look at the top ${context.player.getProvinces((a) => !a.isBroken).length} cards of their conflict deck`);
    }
}


export default ThirdWhiskerSneak;
