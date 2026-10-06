import DrawCard from '../../DrawCard.js';
import { gainAbility } from '../../effects.js';
import { removeFate, sacrifice, sequential } from '../../GameActions/GameActions.js';
import { AbilityType, CardType } from '../../Constants.js';

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
            effect: gainAbility(AbilityType.Reaction, {
                title: 'Return all fate from, then sacrifice a character',
                when: {
                    afterConflict: (event, context) => {
                        return event.conflict.winner === context.source.controller && context.source.isParticipating();
                    }
                },
                printedAbility: false,
                effect: 'force {1} to sacrifice {0}, returning all its fate to {1}\'s fate pool',
                effectArgs: (context) => [context.target?.controller],
                target: {
                    cardType: CardType.Character,
                    cardCondition: (card) => card.isParticipating(),
                    gameAction: sequential([
                        removeFate((context) => ({
                            amount: context.target?.getFate(),
                            recipient: context.target?.owner
                        })),
                        sacrifice((context) => ({
                            target: context.target
                        }))
                    ])
                }
            })
        });
    }
}


export default Chikara;
