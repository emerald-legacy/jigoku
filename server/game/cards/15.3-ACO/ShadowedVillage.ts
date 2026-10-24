import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { CardType, Phase } from '../../Constants.js';

class ShadowedVillage extends DrawCard {
    static id = 'shadowed-village';

    override setupCardAbilities() {
        this.reaction('Draw cards')
            .when({
                onMoveFate: (event, context) =>
                    context.game.currentPhase !== Phase.Fate &&
                    // fate leaving with a character that leaves play isn't removed by an effect
                    !event.isContingent &&
                    event.origin &&
                    event.origin.type === CardType.Character &&
                    'controller' in event.origin &&
                    event.origin.controller === context.player &&
                    (event.fate ?? 0) > 0
            })
            .draw((context) => ({
                amount: context.event.origin?.isCard() && context.event.origin.isDishonored ? 2 : 1
            }))
            .chatText((context) => context.event.origin?.isCard() && context.event.origin.isDishonored
                ? msg`draw 2 cards`
                : msg`draw a card`);
    }
}


export default ShadowedVillage;
