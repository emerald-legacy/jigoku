import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, EventName } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class ArdentOmoidasu extends DrawCard {
    static id = 'ardent-omoidasu';

    setupCardAbilities() {
        this.reaction({
            title: 'Steal 2 honor',
            when: {
                onCardDishonored: (event: EventPayload<EventName.OnCardDishonored>, context) => {
                    if(!event.context) {
                        return false;
                    }
                    const isCharacter = event.card.type === CardType.Character;
                    const dishonoredByOpponentsEffect = (context.player.opponent === event.context.player);
                    const dishonoredByRingEffect = ((event.context.source.type as string) === 'ring');
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
