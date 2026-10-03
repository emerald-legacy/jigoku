import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType } from '../../Constants.js';

import Ring from '../../Ring.js';
class ArdentOmoidasu extends DrawCard {
    static id = 'ardent-omoidasu';

    setupCardAbilities() {
        this.reaction('Steal 2 honor')
            .when({
                onCardDishonored: (event, context) => {
                    if(!event.context) {
                        return false;
                    }
                    const isCharacter = event.card.type === CardType.Character;
                    const dishonoredByOpponentsEffect = (context.player.opponent === event.context.player);
                    const dishonoredByRingEffect = (event.context.source instanceof Ring);
                    const dishonoredByCardEffect = event.context.ability.isCardAbility();
                    const dishonoredCharacterBelongsToOmoidasuController = event.card.controller === context.player;
                    return isCharacter && dishonoredCharacterBelongsToOmoidasuController &&
                        dishonoredByOpponentsEffect &&
                        (dishonoredByRingEffect || dishonoredByCardEffect);
                }
            })
            .gameAction(AbilityDsl.actions.takeHonor({
                amount: 2
            }));
    }
}


export default ArdentOmoidasu;
