import { CardTypes, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../drawcard.js';

export default class DaidojiNami extends DrawCard {
    static id = 'daidoji-nami';

    setupCardAbilities() {
        this.action({
            title: 'Send a character home',
            condition: (context) => context.source.isParticipating(),
            cost: AbilityDsl.costs.sacrifice({
                cardType: CardTypes.Character,
                cardCondition: (card) => card.isParticipating()
            }),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Opponent,
                cardCondition: (card) => card.isParticipating(),
                gameAction: AbilityDsl.actions.sendHome()
            }
        });
    }
}
