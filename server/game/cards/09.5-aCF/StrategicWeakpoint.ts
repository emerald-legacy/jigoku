import DrawCard from '../../DrawCard.js';
import { CardType, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class StrategicWeapoint extends DrawCard {
    static id = 'strategic-weakpoint';

    setupCardAbilities() {
        this.interrupt('Force opponent to discard a character')
            .when({
                onBreakProvince: (event, context) => event.card.controller === context.player && event.card.location === context.source.location
            })
            .target('target', {
                player: Players.Opponent,
                activePromptTitle: 'Choose a character to discard',
                controller: Players.Opponent,
                cardType: CardType.Character,
                cardCondition: card => card.isAttacking()
            }, AbilityDsl.actions.discardFromPlay());
    }
}


export default StrategicWeapoint;
