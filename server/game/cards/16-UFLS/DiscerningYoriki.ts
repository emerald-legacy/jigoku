import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, EventName, Location } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class DiscerningYoriki extends DrawCard {
    static id = 'discerning-yoriki';

    setupCardAbilities() {
        this.reaction({
            title: 'Honor a character',
            collectiveTrigger: true,
            when: {
                onCardRevealed: (event: EventPayload<EventName.OnCardRevealed>, context) => {
                    const cards = Array.isArray(event.card) ? event.card : [event.card];
                    return cards.some((a: any) => a.location === Location.Hand && a.controller === context.player.opponent);
                },
                onLookAtCards: (event: EventPayload<EventName.OnLookAtCards>, context) => {
                    const raw = event.stateBeforeResolution;
                    const cards = Array.isArray(raw) ? raw : [raw];
                    return cards.some((a: any) => a?.location === Location.Hand && a?.card?.controller === context.player.opponent);
                }
            },
            target: {
                activePromptTitle: 'Choose a character to honor',
                cardType: CardType.Character,
                gameAction: AbilityDsl.actions.honor()
            }
        });
    }
}


export default DiscerningYoriki;
