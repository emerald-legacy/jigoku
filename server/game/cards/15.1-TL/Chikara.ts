import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { gainAbility } from '../../effects.js';
import { removeFate, sacrifice, sequential } from '../../GameActions/GameActions.js';
import { CardType } from '../../Constants.js';

class Chikara extends DrawCard {
    static id = 'chikara';

    setupCardAbilities() {
        this.attachmentConditions({
            myControl: true,
            unique: true,
            faction: 'crab'
        });

        this.whileAttached({
            match: (card) => card.hasTrait('champion'),
            effect: gainAbility.reaction('Return all fate from, then sacrifice a character', {
                afterConflict: (event, context) => {
                    return event.conflict.winner === context.source.controller && context.source.isParticipating();
                }
            }, (ability) => ability
                .target({
                    cardType: CardType.Character,
                    cardCondition: (card) => card.isParticipating()
                }, sequential([
                    removeFate((context) => ({
                        amount: context.target?.getFate(),
                        recipient: context.target?.owner
                    })),
                    sacrifice((context) => ({
                        target: context.target
                    }))
                ]))
                .chatText((context) => msg`force ${context.target?.controller} to sacrifice ${context.chatTarget()}, returning all its fate to ${context.target?.controller}'s fate pool`))
        });
    }
}


export default Chikara;
