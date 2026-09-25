import { CardType, Players } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class EndlessPlains extends ProvinceCard {
    static id = 'endless-plains';

    setupCardAbilities() {
        this.reaction('Force opponent to discard a character')
            .when({
                onConflictDeclared: (event, context) => event.conflict.declaredProvince === context.source
            })
            .cost(AbilityDsl.costs.breakSelf())
            .target('target', {
                player: Players.Opponent,
                activePromptTitle: 'Choose a character to discard',
                controller: Players.Opponent,
                cardType: CardType.Character,
                cardCondition: (card) => card.isAttacking()
            }, AbilityDsl.actions.discardFromPlay());
    }
}
