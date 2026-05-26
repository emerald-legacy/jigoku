import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes, EventNames } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class ArdentOmoidasu extends DrawCard {
    static id = 'ardent-omoidasu';

    setupCardAbilities() {
        this.reaction({
            title: 'Steal 2 honor',
            when: {
                onCardDishonored: (event: EventPayload<EventNames.OnCardDishonored>, context) => {
                    if(!event.context) {
                        return false;
                    }
                    const isCharacter = event.card.type === CardTypes.Character;
                    const dishonoredByOpponentsEffect = (context.player.opponent === event.context.player);
                    const dishonoredByRingEffect = (event.context.source.type === 'ring');
                    const dishonoredByCardEffect = event.context.ability.isCardAbility();
                    const dishonoredCharacterBelongsToOmoidasuController = event.card.controller === context.player;
                    return isCharacter && dishonoredCharacterBelongsToOmoidasuController &&
                        dishonoredByOpponentsEffect &&
                        (dishonoredByRingEffect || dishonoredByCardEffect);
                }
            },
            gameAction: AbilityDsl.actions.takeHonor({
                amount: 2
            })
        });
    }
}


export default ArdentOmoidasu;
