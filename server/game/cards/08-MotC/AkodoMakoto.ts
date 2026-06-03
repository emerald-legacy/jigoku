import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class AkodoMakoto extends DrawCard {
    static id = 'akodo-makoto';

    setupCardAbilities() {
        this.reaction({
            title: 'Remove fate/discard character',
            when: {
                afterConflict: (event, context) => {
                    return event.conflict.winner === context.source.controller && context.source.isParticipating();
                }
            },
            target: {
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card) => {
                    return card.hasTrait('courtier') && card.isParticipating();
                },
                gameAction: AbilityDsl.actions.conditional({
                    condition: context => context.target.getFate() > 0,
                    trueGameAction: AbilityDsl.actions.removeFate(),
                    falseGameAction: AbilityDsl.actions.discardFromPlay()
                })
            }
        });
    }
}


export default AkodoMakoto;
