import { CardType, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class BakeKujira extends DrawCard {
    static id = 'bake-kujira';

    setupCardAbilities() {
        this.legendary(1);

        this.reaction('Eat a character')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.winner === context.source.controller && context.source.isParticipating()
            })
            .target({
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card, context) => card.isParticipating() && card !== context.source
            }, AbilityDsl.actions.injure());
    }
}
